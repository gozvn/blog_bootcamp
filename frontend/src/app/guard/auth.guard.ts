import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    let token = null;

    if (typeof window !== 'undefined') {
    token = localStorage.getItem("accessToken");
    }

    if (token) {
        return true;
    }

    router.navigate(['auth', 'login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
