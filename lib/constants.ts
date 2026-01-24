import { TierLimits } from "./types"

export const FREE_TIER_LIMITS: TierLimits = {
    max_projects: 5,
    max_endpoints_per_project: 2,
    allow_global_pings: false,
    allow_github_integration: true,
    max_history_days: 7,
    min_ping_interval_minute: 10,
    team_members_allowed: false,
    max_team_members_per_project: 0
}
export const PRO_TIER_LIMITS: TierLimits = {
    max_projects: 20,
    max_endpoints_per_project: 5,
    allow_global_pings: true,
    allow_github_integration: true,
    max_history_days: 30,
    min_ping_interval_minute: 10,
    team_members_allowed: true,
    max_team_members_per_project: 10
}