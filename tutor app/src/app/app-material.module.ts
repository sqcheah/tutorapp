import { NgModule } from "@angular/core";
import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatDialogModule,
  MatChipsModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  MatGridListModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatSnackBarModule
} from "@angular/material";

import { LayoutModule } from "@angular/cdk/layout";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { MatRadioModule } from "@angular/material/radio";
import { BidiModule } from "@angular/cdk/bidi";

@NgModule({
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    LayoutModule,
    MatGridListModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDialogModule,
    MatChipsModule,
    BidiModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  providers: [],
  declarations: []
})
export class AppMaterialModule {}
