import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleName',
    standalone: true
})
export class RoleNamePipe implements PipeTransform {

    transform(value: number | string): string {
        // Convert "1", "2", "3" → number
        const v = Number(value);

        switch (v) {
            case 1: return 'Admin';
            case 2: return 'Mod';
            case 3: return 'User';
            case 4: return 'Guest';
            default: return 'Unknown';
        }
    }
}
