// Restored from ref/webview/assets/plan-pricing-dtn4oxxh.js
// PlanPricing chunk restored from the Codex webview bundle.
export function planPricingT({
  intl: _planPricingT,
  amount: _planPricingN,
  currencyCode,
  minorUnitExponent,
}) {
  return _planPricingN == null
    ? null
    : _planPricingT.formatNumber(
        _planPricingN,
        planPricingHelper1(currencyCode, minorUnitExponent),
      );
}
export function planPricingN({
  intl: _planPricingT,
  amount: _planPricingN,
  currencyCode,
  minorUnitExponent,
}) {
  if (_planPricingN == null) return null;
  let planPricingValue1 = currencyCode,
    planPricingValue2 = _planPricingT.formatNumberToParts(
      _planPricingN,
      planPricingHelper1(currencyCode, minorUnitExponent, "symbol"),
    );
  if (
    planPricingValue2.some(
      ({ type: __planPricingT, value: __planPricingN }) =>
        __planPricingT === "currency" && __planPricingN === currencyCode,
    )
  ) {
    let planPricingValue3 = _planPricingT.formatNumberToParts(
      _planPricingN,
      planPricingHelper1(currencyCode, minorUnitExponent),
    );
    planPricingValue3.some(
      ({ type: __planPricingT, value: __planPricingN }) =>
        __planPricingT === "currency" && __planPricingN !== currencyCode,
    )
      ? (planPricingValue2 = planPricingValue3)
      : (planPricingValue1 = null);
  }
  return {
    currencyCodeLabel: planPricingValue1,
    formatted: planPricingValue2
      .map(({ value: __planPricingT }) => __planPricingT)
      .join(""),
    parts: planPricingValue2,
  };
}
function planPricingHelper1(
  _planPricingT,
  _planPricingN,
  planPricingParam1 = "narrowSymbol",
) {
  return {
    style: "currency",
    currency: _planPricingT,
    currencyDisplay: planPricingParam1,
    trailingZeroDisplay: "stripIfInteger",
    minimumFractionDigits: _planPricingN ?? undefined,
    maximumFractionDigits: _planPricingN ?? undefined,
  };
}
