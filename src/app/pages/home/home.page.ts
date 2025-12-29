import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInput,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonChip,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonText,
  IonMenuButton,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  trashOutline, 
  checkmarkDoneOutline,
  filterOutline,
  settingsOutline,
  folderOutline,
  listOutline,
  menuOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { StorageService } from '../../services/storage.service';
import { CategoryService } from '../../services/category.service';
import { FirebaseService } from '../../services/firebase.service';

/**
 * Página Principal - Lista de Tareas
 * 
 * Esta página muestra la lista de tareas y permite:
 * - Ver todas las tareas
 * - Agregar nuevas tareas
 * - Marcar tareas como completadas
 * - Eliminar tareas (deslizando)
 * - Filtrar por categoría
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonInput,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonBadge,
    IonChip,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonText,
    IonMenuButton
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  
  // Lista de tareas a mostrar
  tasks: Task[] = [];
  
  // Lista de categorías
  categories: Category[] = [];
  
  // Texto de la nueva tarea
  newTaskTitle: string = '';
  
  // Categoría seleccionada para filtrar (null = todas)
  selectedCategoryId: string | null = null;
  
  // Categoría para nueva tarea
  newTaskCategoryId: string = '';
  
  // Feature flag: ¿están habilitadas las categorías?
  categoriesEnabled: boolean = true;
  
  // Suscripciones para limpiar al destruir
  private subscriptions: Subscription[] = [];

  constructor(
    private storageService: StorageService,
    private categoryService: CategoryService,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Registrar los iconos que vamos a usar
    addIcons({ 
      addOutline, 
      trashOutline, 
      checkmarkDoneOutline,
      filterOutline,
      settingsOutline,
      folderOutline,
      listOutline,
      menuOutline
    });
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en las tareas
    const tasksSub = this.storageService.tasks$.subscribe(tasks => {
      this.filterTasks();
    });
    this.subscriptions.push(tasksSub);
    
    // Suscribirse a los cambios en las categorías
    const categoriesSub = this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
    this.subscriptions.push(categoriesSub);
    
    // Suscribirse a los feature flags
    const flagsSub = this.firebaseService.flags$.subscribe(flags => {
      this.categoriesEnabled = flags.enable_categories;
    });
    this.subscriptions.push(flagsSub);
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Filtra las tareas según la categoría seleccionada
   */
  filterTasks(): void {
    if (this.selectedCategoryId) {
      this.tasks = this.storageService.getTasksByCategory(this.selectedCategoryId);
    } else {
      this.tasks = this.storageService.getTasks();
    }
  }

  /**
   * Agrega una nueva tarea
   */
  async addTask(): Promise<void> {
    // Validar que haya texto
    if (!this.newTaskTitle.trim()) {
      await this.showToast('Por favor escribe una tarea', 'warning');
      return;
    }
    
    // Verificar límite de tareas (feature flag)
    const maxTasks = this.firebaseService.getMaxTasks();
    if (this.storageService.getTasks().length >= maxTasks) {
      await this.showToast(`Máximo ${maxTasks} tareas permitidas`, 'warning');
      return;
    }
    
    // Agregar la tarea
    const categoryId = this.categoriesEnabled ? this.newTaskCategoryId : undefined;
    this.storageService.addTask(this.newTaskTitle.trim(), categoryId || undefined);
    
    // Limpiar input
    this.newTaskTitle = '';
    this.newTaskCategoryId = '';
    
    // Actualizar lista
    this.filterTasks();
    
    await this.showToast('Tarea agregada', 'success');
  }

  /**
   * Cambia el estado de completado de una tarea
   */
  toggleComplete(task: Task): void {
    this.storageService.toggleTaskComplete(task.id);
    this.filterTasks();
  }

  /**
   * Elimina una tarea con confirmación
   */
  async deleteTask(task: Task): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: `¿Estás seguro de eliminar "${task.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.storageService.deleteTask(task.id);
            this.filterTasks();
            this.showToast('Tarea eliminada', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Cambia el filtro de categoría
   */
  onCategoryFilterChange(): void {
    this.filterTasks();
  }

  /**
   * Obtiene el nombre de una categoría por su ID
   */
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categoryService.getCategoryById(categoryId);
    return category ? category.name : '';
  }

  /**
   * Obtiene el color de una categoría por su ID
   */
  getCategoryColor(categoryId: string | undefined): string {
    if (!categoryId) return '#92949c';
    const category = this.categoryService.getCategoryById(categoryId);
    return category ? category.color : '#92949c';
  }

  /**
   * Muestra un mensaje toast
   */
  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  /**
   * TrackBy para optimizar el renderizado de la lista
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
