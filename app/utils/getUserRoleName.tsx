export function GetUserRoleName(roleId?: number): string {
  switch (roleId) {
    case 1:
      return "admin";
    case 2:
      return "student";
    case 3:
      return "instructor";
    case 4:
      return "corporate";
    default:
      return "unknown";
  }
}

export function GetUserStatusName(statusId?: number): string {
  switch (statusId) {
    case 1:
      return "Active";
    case 2:
      return "Blocked";
    case 3:
      return "Pending";
    default:
      return "unknown";
  }
}
