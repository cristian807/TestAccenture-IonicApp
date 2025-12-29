import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonNote,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  trashOutline, 
  createOutline,
  folderOutline,
  colorPaletteOutline,
  menuOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { Category, CATEGORY_COLORS } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonBadge,
    IonNote
  ],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {
  
  // Lista de categorías
  categories: Category[] = [];
  

  newCategoryName: string = '';
  

  selectedColor: string = CATEGORY_COLORS[0];
  

  availableColors = CATEGORY_COLORS;
  

  private subscriptions: Subscription[] = [];

  constructor(
    private categoryService: CategoryService,
    private storageService: StorageService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Registrar iconos
    addIcons({ 
      addOutline, 
      trashOutline, 
      createOutline,
      folderOutline,
      colorPaletteOutline,
      menuOutline
    });
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en las categorías
    const sub = this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  async addCategory(): Promise<void> {
    if (!this.newCategoryName.trim()) {
      await this.showToast('Escribe un nombre para la categoría', 'warning');
      return;
    }
    
    this.categoryService.addCategory(this.newCategoryName.trim(), this.selectedColor);
    this.newCategoryName = '';
    this.selectedColor = CATEGORY_COLORS[0];
    
    await this.showToast('Categoría creada', 'success');
  }


  async editCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de la categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.name.trim()) {
              this.categoryService.updateCategory(category.id, { name: data.name.trim() });
              this.showToast('Categoría actualizada', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async deleteCategory(category: Category): Promise<void> {
    const taskCount = this.storageService.countTasksByCategory(category.id);
    
    const alert = await this.alertController.create({
      header: 'Eliminar Categoría',
      message: taskCount > 0 
        ? `Esta categoría tiene ${taskCount} tarea(s). ¿Estás seguro de eliminarla?`
        : `¿Eliminar la categoría "${category.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.categoryService.deleteCategory(category.id);
            this.showToast('Categoría eliminada', 'success');
          }
        }
      ]
    });
    await alert.present();
  }


  selectColor(color: string): void {
    this.selectedColor = color;
  }


  getTaskCount(categoryId: string): number {
    return this.storageService.countTasksByCategory(categoryId);
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }


  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}
