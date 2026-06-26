// Restored from ref/webview/assets/dist-eWHzKSsV.js
//
// BOUNDARY FACADE for bundled Radix UI runtime helpers used by local app code.
// Includes primitives, presence, slot, refs, controllable state, and context APIs.
//
// eslint-disable @typescript-eslint/no-explicit-any
import * as React from "react";
import * as ReactDOM from "react-dom";

/* --------------------------------------------------------------------------
 * Event helpers
 * -------------------------------------------------------------------------- */

export function composeEventHandlers<
  E extends React.SyntheticEvent | Event,
>(
  originalEventHandler: ((event: E) => void) | undefined,
  ourEventHandler: ((event: E) => void) | undefined,
  { checkForDefaultPrevented = true }: { checkForDefaultPrevented?: boolean } = {},
): (event: E) => void {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !(event as any).defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export function dispatchDiscreteCustomEvent(
  target: EventTarget,
  event: Event,
): void {
  if (target) {
    ReactDOM.flushSync(() => target.dispatchEvent(event));
  }
}

/* --------------------------------------------------------------------------
 * Ref helpers
 * -------------------------------------------------------------------------- */

function setRef<T>(ref: React.Ref<T> | undefined, value: T): (() => void) | void {
  if (typeof ref === "function") {
    const cleanup = ref(value);
    return cleanup;
  } else if (ref != null) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: Array<React.Ref<T>>): (node: T | null) => (() => void) | void {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

export function useComposedRefs<T>(...refs: Array<React.Ref<T>>): (node: T | null) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

/* --------------------------------------------------------------------------
 * Slot
 * -------------------------------------------------------------------------- */

const SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && typeof child.type === "function" && (child.type as any).__radixId === SLOTTABLE_IDENTIFIER;
}

function getElementRef(element: React.ReactElement) {
  const propRef = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  const propRefWarning = propRef && "isReactWarning" in propRef && propRef.isReactWarning;
  if (propRefWarning) {
    return element.ref;
  }

  const elementRef = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  const elementRefWarning = elementRef && "isReactWarning" in elementRef && elementRef.isReactWarning;
  if (elementRefWarning) {
    return element.props.ref;
  }

  return element.props.ref || element.ref;
}

function mergeProps(slotProps: Record<string, any>, childProps: Record<string, any>): Record<string, any> {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: any[]) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}

function createSlotClone(ownerName: string) {
  const SlotClone = React.forwardRef<any, any>((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (React.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const mergedProps = mergeProps(slotProps, children.props);
      if (children.type !== React.Fragment) {
        mergedProps.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React.cloneElement(children, mergedProps);
    }
    return React.Children.count(children) > 1 ? React.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}

export function Slot(ownerName: string) {
  const SlotClone = createSlotClone(ownerName);
  const SlotComponent = React.forwardRef<any, any>((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const slottableChild = (slottable as React.ReactElement).props.children;
      const newChildren = childrenArray.map((child) =>
        child === slottable
          ? React.Children.count(slottableChild) > 1
            ? React.Children.only(null)
            : React.isValidElement(slottableChild)
              ? (slottableChild as React.ReactElement).props.children
              : null
          : child,
      );
      return React.createElement(
        SlotClone,
        { ...slotProps, ref: forwardedRef },
        React.isValidElement(slottableChild)
          ? React.cloneElement(slottableChild, undefined, newChildren)
          : null,
      );
    }
    return React.createElement(SlotClone, { ...slotProps, ref: forwardedRef }, children);
  });
  SlotComponent.displayName = `${ownerName}.Slot`;
  return SlotComponent;
}

/* --------------------------------------------------------------------------
 * Primitives
 * -------------------------------------------------------------------------- */

type PrimitivePropsWithRef<C extends React.ElementType> = React.ComponentPropsWithRef<C> & {
  asChild?: boolean;
};

const NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul",
] as const;

export const Primitive = NODES.reduce((acc, node) => {
  const NodeSlot = Slot(`Primitive.${node}`);
  const Component = React.forwardRef<any, PrimitivePropsWithRef<typeof node>>(
    ({ asChild, ...props }, forwardedRef) => {
      const Comp: any = asChild ? NodeSlot : node;
      if (typeof window !== "undefined") {
        (window as any)[Symbol.for("radix-ui")] = true;
      }
      return React.createElement(Comp, { ...props, ref: forwardedRef });
    },
  );
  (Component as any).displayName = `Primitive.${node}`;
  return { ...acc, [node]: Component };
}, {} as Record<(typeof NODES)[number], React.ForwardRefExoticComponent<PrimitivePropsWithRef<any>>>);

/* --------------------------------------------------------------------------
 * Presence
 * -------------------------------------------------------------------------- */

function usePrevious<T>(value: T) {
  const [previous, setPrevious] = React.useState(value);
  React.useEffect(() => {
    if (value !== previous) {
      setPrevious(value);
    }
  }, [value, previous]);
  return previous;
}

function getAnimationName(styles?: CSSStyleDeclaration | null) {
  return styles?.animationName || "none";
}

function getElementRef2(element: React.ReactElement) {
  const propRef = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  const propRefWarning = propRef && "isReactWarning" in propRef && propRef.isReactWarning;
  if (propRefWarning) {
    return element.ref;
  }

  const elementRef = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  const elementRefWarning = elementRef && "isReactWarning" in elementRef && elementRef.isReactWarning;
  if (elementRefWarning) {
    return element.props.ref;
  }

  return element.props.ref || element.ref;
}

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>();
  const stylesRef = React.useRef<CSSStyleDeclaration | null>(null);
  const prevPresentRef = React.useRef(present);
  const prevAnimationNameRef = React.useRef<string>("none");

  type MachineState = "mounted" | "unmountSuspended" | "unmounted";
  type MachineEvent = "MOUNT" | "UNMOUNT" | "ANIMATION_OUT" | "ANIMATION_END";
  const [state, send] = React.useReducer(
    (state: MachineState, event: MachineEvent): MachineState => {
      const transitions: Record<MachineState, Partial<Record<MachineEvent, MachineState>>> = {
        mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
        unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
        unmounted: { MOUNT: "mounted" },
      };
      return transitions[state][event] ?? state;
    },
    present ? "mounted" : "unmounted",
  );

  React.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);

  useLayoutEffect(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;

    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);

      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        send(wasPresent && isAnimating ? "ANIMATION_OUT" : "UNMOUNT");
      }

      prevPresentRef.current = present;
    }
  }, [present, send]);

  useLayoutEffect(() => {
    if (node) {
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      let timeoutId: ReturnType<typeof setTimeout>;

      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const originalFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = originalFillMode;
              }
            });
          }
        }
      };

      const handleAnimationStart = (event: AnimationEvent) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };

      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);

  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: React.useCallback(
      (node: HTMLElement | null) => {
        if (node) {
          stylesRef.current = getComputedStyle(node);
        }
        setNode(node ?? undefined);
      },
      [setNode],
    ),
  };
}

export function Presence({
  present,
  children,
}: {
  present: boolean;
  children: React.ReactElement | ((props: { present: boolean }) => React.ReactElement);
}) {
  const { isPresent, ref } = usePresence(present);
  const child = typeof children === "function" ? children({ present: isPresent }) : React.Children.only(children);
  const composedRef = useComposedRefs(ref, getElementRef2(child));

  if (typeof children === "function" || isPresent) {
    return React.cloneElement(child, { ref: composedRef } as any);
  }
  return null;
}

/* --------------------------------------------------------------------------
 * useLayoutEffect
 * -------------------------------------------------------------------------- */

export const useLayoutEffect = typeof document !== "undefined" ? React.useLayoutEffect : () => {};

/* --------------------------------------------------------------------------
 * useControllableState
 * -------------------------------------------------------------------------- */

function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback(((...args) => callbackRef.current?.(...args)) as T, []);
}

function useInsertionEffect(callback: React.EffectCallback, deps?: React.DependencyList) {
  const insertionEffect = React.useInsertionEffect || useLayoutEffect;
  insertionEffect(callback, deps);
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
  caller,
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
  caller?: string;
}): [T, (value: T | ((prev: T) => T)) => void] {
  const [uncontrolledState, setUncontrolledState, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop! : uncontrolledState;

  const isControlledRef = React.useRef(isControlled);
  React.useEffect(() => {
    const wasControlled = isControlledRef.current;
    if (wasControlled !== isControlled) {
      const from = wasControlled ? "controlled" : "uncontrolled";
      const to = isControlled ? "controlled" : "uncontrolled";
      console.warn(
        `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
      );
    }
    isControlledRef.current = isControlled;
  }, [isControlled, caller]);

  const setValue = React.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop as T) : nextValue;
        if (value !== prop) {
          onChangeRef.current?.(value);
        }
      } else {
        setUncontrolledState(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledState, onChangeRef],
  );

  return [value, setValue];
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: {
  defaultProp?: T;
  onChange?: (value: T) => void;
}) {
  const [value, setValue] = React.useState(defaultProp);
  const prevValueRef = React.useRef(value);
  const onChangeRef = useCallbackRef(onChange);

  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, onChangeRef]);

  return [value, setValue, onChangeRef] as const;
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}

/* --------------------------------------------------------------------------
 * Context (scoped)
 * -------------------------------------------------------------------------- */

export function createContext<ContextValueType>(
  scopeName: string,
  defaultValue?: ContextValueType,
): [React.FC<{ children: React.ReactNode } & ContextValueType>, (consumerName: string) => ContextValueType] {
  const Context = React.createContext<ContextValueType | undefined>(defaultValue);

  const Provider: React.FC<{ children: React.ReactNode } & Partial<ContextValueType>> = (props) => {
    const { children, ...context } = props;
    const value = React.useMemo(() => context as ContextValueType, Object.values(context));
    return React.createElement(Context.Provider, { value }, children);
  };
  Provider.displayName = `${scopeName}Provider`;

  function useContext(consumerName: string): ContextValueType {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`\`${consumerName}\` must be used within \`${scopeName}\``);
  }

  return [Provider, useContext];
}

export function createContextScope(
  scopeName: string,
  createContextScopeDeps: Array<() => { scopeName: string }> = [],
): [
  <ContextValueType>(
    name: string,
    defaultValue?: ContextValueType,
  ) => [React.FC<{ scope: any; children: React.ReactNode } & ContextValueType>, (consumerName: string, scope?: any) => ContextValueType],
  () => (scope: any) => { [key: string]: any },
] {
  const defaultContexts: Array<React.Context<any>> = [];

  function createScopedContext<ContextValueType>(
    name: string,
    defaultValue?: ContextValueType,
  ): [React.FC<{ scope: any; children: React.ReactNode } & ContextValueType>, (consumerName: string, scope?: any) => ContextValueType] {
    const Context = React.createContext<ContextValueType | undefined>(defaultValue);
    defaultContexts.push(Context);

    const Provider: React.FC<{ scope: any; children: React.ReactNode } & Partial<ContextValueType>> = (props) => {
      const { scope, children, ...context } = props;
      const index = defaultContexts.indexOf(Context);
      const scopedContext = scope?.[scopeName]?.[index] || Context;
      const value = React.useMemo(() => context as ContextValueType, Object.values(context));
      return React.createElement(scopedContext.Provider, { value }, children);
    };
    Provider.displayName = `${name}Provider`;

    function useContext(consumerName: string, scope?: any): ContextValueType {
      const index = defaultContexts.indexOf(Context);
      const scopedContext = scope?.[scopeName]?.[index] || Context;
      const context = React.useContext(scopedContext);
      if (context) return context;
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`\`${consumerName}\` must be used within \`${name}\``);
    }

    return [Provider, useContext];
  }

  const createScope: () => (scope: any) => { [key: string]: any } = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => React.createContext(defaultContext));
    return function useScope(scope: any) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React.useMemo(
        () => ({
          [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts },
        }),
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;

  return [createScopedContext, composeCreateScope(createScope, ...createContextScopeDeps)];
}

function composeCreateScope(...scopes: Array<() => { scopeName: string }>) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: any = () => {
    const scopeHooks = scopes.map((scope) => ({
      useScope: (scope as any)(),
      scopeName: scope.scopeName,
    }));
    return function useComposedScope(scope: any) {
      const scopes2 = scopeHooks.reduce((acc, { useScope, scopeName }) => {
        const scopeProps = useScope(scope);
        return { ...acc, ...scopeProps[`__scope${scopeName}`] };
      }, {});
      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: scopes2 }), [scopes2]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
