export enum TEAM_PLAN_ENUM {
  FREE = 'free',
  PLUS = 'plus',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
}

export const TEAM_PLAN_MAP = {
  [TEAM_PLAN_ENUM.FREE]: 'Starter',
  [TEAM_PLAN_ENUM.PLUS]: 'Plus',
  [TEAM_PLAN_ENUM.BUSINESS]: 'Business',
  [TEAM_PLAN_ENUM.ENTERPRISE]: 'Enterprise',
};

export enum PLAN_ACTION_ENUM {
  hidden,
  free,
  contact,
  subscribe,
  more,
  upgrade,
  freeTrial = -3,
  freeMore = -4,
  freeUpgrade = -5,
}

export const PLAN_ACTION_MAP = {
  [PLAN_ACTION_ENUM.hidden]: '',
  [PLAN_ACTION_ENUM.free]: 'Start for free',
  [PLAN_ACTION_ENUM.contact]: 'Contact us',
  [PLAN_ACTION_ENUM.subscribe]: 'Subscribe',
  [PLAN_ACTION_ENUM.more]: 'Add more seats',
  [PLAN_ACTION_ENUM.upgrade]: 'Subscribe',
  [PLAN_ACTION_ENUM.freeTrial]: 'Subscribe',
  [PLAN_ACTION_ENUM.freeMore]: 'Add more seats',
  [PLAN_ACTION_ENUM.freeUpgrade]: 'Subscribe',
};

export const PLAN_ACTION_TITLE_MAP = {
  [PLAN_ACTION_ENUM.freeTrial]: 'Free trial',
  [PLAN_ACTION_ENUM.freeMore]: 'Add more seats',
  [PLAN_ACTION_ENUM.freeUpgrade]: 'Upgrade',
};

export enum Bill_TYPE_ENUM {
  cancel,
  contact,
}

export const BILL_TYPE_MAP = {
  [Bill_TYPE_ENUM.cancel]: {
    title: 'Cancel plan',
    content:
      'Please email us to explain the reason for cancelling your plan, so that we can assist you better',
  },
  [Bill_TYPE_ENUM.contact]: {
    title: 'Contact support',
    content:
      'Please describe your specific requirements via email to receive assistance. We will contact you promptly to help resolve any issues.',
  },
};

export enum VALIDATE_ACTION {
  /**Create new project */
  ADD_PROJECT,
  /**Stress testing */
  STRESS_TESTING,
  /**Sync tasks */
  SYNC_TASKS,
}

export const TEAM_SIZE_OPTIONS = [
  {
    value: '1-30 members',
    label: '1-30 members',
  },
  {
    value: '30-100 members',
    label: '30-100 members',
  },
  {
    value: '100-300 members',
    label: '100-300 members',
  },
  {
    value: '300+ members',
    label: '300+ members',
  },
];

export enum PRICES_CYCLE_ENUM {
  monthly = 'monthly',
  annual = 'annual',
}
