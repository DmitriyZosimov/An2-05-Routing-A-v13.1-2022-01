import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TaskModel} from './../../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  @Input() task!: TaskModel;
  @Output() completeTask = new EventEmitter<TaskModel>();
  @Output() editTask = new EventEmitter<TaskModel>();
  @Output() deleteTask = new EventEmitter<TaskModel>();

  onCompleteTask(): void {
    this.completeTask.emit(this.task);
  }

  onEditTask(): void {
    this.editTask.emit(this.task);
  }

  onDeleteTask(): void {
    this.deleteTask.emit(this.task);
  }

}
