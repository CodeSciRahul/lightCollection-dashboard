export const canAccessDashboard = (user) =>
  user?.role === "admin" || user?.role === "seller";

export const getDefaultRouteForUser = (user) => {
  if (!user) return "/auth";

  if (user.role === "admin") return "/admin";

  if (user.role === "seller") {
    if (!user.seller) return "/seller/onboarding";
    if (user.seller.approvalStatus === "Approved") return "/seller";
    return "/seller/profile";
  }

  // Customers / unknown roles have no dashboard home.
  return "/auth";
};

export const isApprovedSeller = (user) =>
  user?.role === "seller" && user?.seller?.approvalStatus === "Approved";

export const hasSellerProfile = (user) => !!user?.seller;
