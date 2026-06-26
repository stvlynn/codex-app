// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Role-to-plugin-suggestions map aggregating all role-specific configs.

import {
  engineeringPluginSuggestions,
  productManagementPluginSuggestions,
} from "./plugin-suggestions-eng-prod";
import {
  financePluginSuggestions,
  marketingPluginSuggestions,
} from "./plugin-suggestions-finance-data";
import { salesPluginSuggestions } from "./plugin-suggestions-sales-design";
import {
  operationsPluginSuggestions,
  peopleHrPluginSuggestions,
} from "./plugin-suggestions-ops-people";
import {
  legalPluginSuggestions,
  dataSciencePluginSuggestions,
} from "./plugin-suggestions-legal-data";
import { legalPluginSuggestions as designPluginSuggestions } from "./plugin-suggestions-people-legal";
import {
  studentPluginSuggestions,
  hrPluginSuggestions,
} from "./plugin-suggestions-hr-student";
const allRolePluginSuggestions = {
  data_science: [...dataSciencePluginSuggestions],
  default: [...engineeringPluginSuggestions],
  design: [...designPluginSuggestions],
  engineering: [...engineeringPluginSuggestions],
  finance: [...financePluginSuggestions],
  legal: [...legalPluginSuggestions],
  marketing: [...marketingPluginSuggestions],
  operations: [...operationsPluginSuggestions],
  people_hr: [...peopleHrPluginSuggestions],
  product_management: [...productManagementPluginSuggestions],
  sales: [...salesPluginSuggestions],
  something_else: [...hrPluginSuggestions],
  student: [...studentPluginSuggestions],
};
export { allRolePluginSuggestions };
