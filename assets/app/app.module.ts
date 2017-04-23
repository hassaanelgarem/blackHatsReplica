import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { MomentModule } from 'angular2-moment';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { DateTimePickerModule } from 'ng2-date-time-picker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FocusDirective } from './directives/focus.directive';
import { RatingModule } from "ngx-rating";
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AdminModule } from './admin/admin.module';
import { LoaderComponent } from './loader.component';
import { AppComponent } from "./app.component";
import { BusinessPageComponent } from "./businessPage/businessPage.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { HomepageComponent} from "./homepage/homepage.component";
import { NavComponent} from "./navigationBar/nav.component";
import { RegisterComponent} from "./user/register/register.component";
import { BusinessRegisterComponent} from "./business/register/businessRegister.component";
import { SearchComponent} from "./homepage/search/search.component";
import { SearchResultComponent} from "./homepage/search/SearchResult/result.component";
import { TopBusinessesComponent } from "./homepage/topBusinesses/topBusinesses.component";
import { AdSlotsComponent } from "./homepage/adSlots/adSlots.component";
import { FooterComponent } from "./footer/footer.component";
import { LoginComponent} from "./user/login/login.component";
import { ResetPasswordComponent } from "./user/resetPassword/resetPassword.component";
import { TermsComponent } from "./terms/terms.component";
import { PolicyComponent } from "./policy/policy.component";
import { VerifyComponent } from "./user/verify/verify.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { BusinessReviewsComponent} from "./businessEdit/reviews/businessReviews.component"
import { BusinessActivitiesComponent} from "./businessEdit/activities/businessActivities.component"
import { EditActivityComponent} from "./businessEdit/activities/editActivity.component"
import { EditProfileComponent } from "./businessEdit/editProfile/editProfile.component";
import { AddPhotoComponent } from "./businessEdit/addPhoto/addPhoto.component";
import { BookAdvComponent } from "./businessEdit/bookAdv/bookAdv.component";
import { ActivityBookingsComponent } from "./businessEdit/activityBookings/activityBookings.component";
import { UserComponent } from "./user/user.component";
import { HeaderComponent }from "./user/header.component";
import { ReviewComponent } from "./user/reviews/review.component";
import { UserFavoritesComponent } from "./user/favorites/favorites.component";
import { UserBookingsComponent } from "./user/bookings/userBookings.component";
import { EditUserProfileComponent } from "./user/editProfile/editProfile.component";
import { FourofourComponent } from "./errors/404.component";
import { NotAuthorizedErrorComponent } from "./errors/notAuthorized.component";
import { SomethingWrongComponent } from "./errors/500.component";
import { ContactSupportComponent } from './contactSupport/contactSupport.component';
import { ActivityPageComponent } from "./businessPage/activityPage.component";


import { BusinessPageService } from "./businessPage/businessPage.service";
import { ReviewsService } from "./reviews/reviews.service";
import { UserRegisterService} from "./user/register/register.service";
import { BusinessRegisterService} from "./business/register/businessRegister.service"
import { AppService } from "./app.service";
import { SearchService } from "./homepage/search/search.service";
import { AdSlotsService } from "./homepage/adSlots/adSlots.service";
import { TopBusinessesService } from "./homepage/topBusinesses/topBusinesses.service";
import { LoginService } from "./user/login/login.service";
import { ResetPasswordService } from "./user/resetPassword/resetPassword.service";
import { VerifyService } from "./user/verify/verify.service";
import { BusinessService } from "./businessEdit/business.service";
import { EditProfileService } from "./businessEdit/editProfile/editProfile.service";
import { AddPhotoService } from "./businessEdit/addPhoto/addPhoto.service";
import { BookAdvService } from "./businessEdit/bookAdv/bookAdv.service";
import { ActivityBookingsService } from "./businessEdit/activityBookings/activityBookings.service";
import { UserService } from "./user/user.service";
import { EditUserProfileService } from "./user/editProfile/editProfile.service";
import { ContactSupportService } from './contactSupport/contactSupport.service';
import { BusinessEditGuard } from "./businessEdit/businessEdit.guard";


const DROPZONE_CONFIG: DropzoneConfigInterface = {
  acceptedFiles: 'image/*'
};


@NgModule({
    declarations : [
      ActivityBookingsComponent,
      AddPhotoComponent,
      AppComponent,
      FourofourComponent,
      UserComponent,
      HeaderComponent,
      ReviewComponent,
      UserFavoritesComponent,
      UserBookingsComponent,
      EditUserProfileComponent,
      FileSelectDirective,
      NotAuthorizedErrorComponent,
      SomethingWrongComponent,
      BusinessPageComponent,
      ReviewsComponent,
      HomepageComponent,
      NavComponent,
      LoginComponent,
      ResetPasswordComponent,
      TermsComponent,
      PolicyComponent,
      RegisterComponent,
      BusinessRegisterComponent,
      SearchComponent,
      SearchResultComponent,
      TopBusinessesComponent,
      AdSlotsComponent,
      FooterComponent,
      VerifyComponent,
      BookAdvComponent,
      BusinessActivitiesComponent,
      BusinessEditComponent,
      BusinessReviewsComponent,
      EditActivityComponent,
      EditProfileComponent,
      ActivityPageComponent,
      FileSelectDirective,
      FocusDirective,
      ContactSupportComponent,
      LoaderComponent
    ],
    imports: [
      BrowserModule,
      CommonModule,
      MomentModule,
      FormsModule,
      HttpModule,
      routing,
      MomentModule,
      DateTimePickerModule,
      DropzoneModule.forRoot(DROPZONE_CONFIG),
      RatingModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAhPwdEndt1K4nL2Q3wjR1P7LITWK794iI'
      }),
      AdminModule
    ],
    providers: [
      AppService,
      SearchService,
      AdSlotsService,
      TopBusinessesService,
      UserRegisterService,
      BusinessRegisterService,
      LoginService,
      BusinessService,
      EditProfileService,
      AddPhotoService,
      BookAdvService,
      ActivityBookingsService,
      ResetPasswordService,
      VerifyService,
      BusinessPageService,
      ReviewsService,
      UserService,
      EditUserProfileService,
      ContactSupportService,
      BusinessEditGuard
    ],
    bootstrap : [AppComponent]
})

export class AppModule {

};
