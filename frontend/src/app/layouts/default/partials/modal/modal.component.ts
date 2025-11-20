import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
    @Input() data: any;

    constructor(public activeModal: NgbActiveModal) {}

    confirm() {
      this.activeModal.close(true);
    }

    cancel() {
      this.activeModal.dismiss(false);
    }
}
