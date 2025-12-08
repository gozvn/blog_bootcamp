import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    if (typeof window === 'undefined') {
        return false;
    }

    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        router.navigate(['auth', 'login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    let userRole: number;
    try {
        const user = JSON.parse(userStr);
        userRole = Number(user.role);
    } catch (error) {
        console.error('Error parsing user data:', error);
        router.navigate(['auth', 'login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // Lấy danh sách role được phép truy cập từ route data, ví dụ [1, 2]
    const allowedRoles = route.data?.['roles'] as number[] | undefined;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        router.navigate(['error', 'error-403']);
        return false;
    }

    return true;
};
