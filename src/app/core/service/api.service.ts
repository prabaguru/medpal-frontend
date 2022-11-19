import { Injectable } from "@angular/core";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { IDoctor } from "../index";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}
  //sendSMS
  sendSMS(data: any) {
    return this.http
      .post(`${environment.apiUrl}/patient_appointments/sendSMS`, data)
      .pipe(catchError(this.handleError));
  }

  //hospital
  hospitalregister(data: IDoctor): Observable<IDoctor[]> {
    return this.http
      .post<IDoctor[]>(`${environment.apiUrl}/hospitals/register`, data)
      .pipe(catchError(this.handleError));
  }

  //doctor
  register(data: IDoctor): Observable<IDoctor[]> {
    return this.http
      .post<IDoctor[]>(`${environment.apiUrl}/doctors/register`, data)
      .pipe(catchError(this.handleError));
  }

  forgotPassWordSendEmail(data: any) {
    return this.http
      .post(`${environment.apiUrl}/doctors/forgotPasswordEmail`, data)
      .pipe(catchError(this.handleError));
  }

  uploadFile(id, profileImage: File, imgUnlink): Observable<any> {
    var formData: any = new FormData();
    formData.append("id", id);
    formData.append("file", profileImage);
    formData.append("imgUnlink", imgUnlink);
    return this.http.put(`${environment.apiUrl}/doctors/uploadFile`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }
  uploadFile2(id, docFile: File, fileUnlink, docType): Observable<any> {
    var formData: any = new FormData();
    formData.append("id", id);
    formData.append("file", docFile);
    formData.append("fileUnlink", fileUnlink);
    formData.append("docType", docType);
    return this.http.put(`${environment.apiUrl}/doctors/uploadDoc`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }
  private handleError(err) {
    //console.log("error caught in service");
    //console.error(err);
    //Handle the error here
    return throwError(err);
  }

  // getAll() {
  //   return this.http.get<User[]>(`${environment.apiUrl}/doctors`);
  // }

  // getAllByIdWeis(searchParams: string) {
  //   //const headers = new HttpHeaders().append('header', 'value');
  //   const params = new HttpParams().append("id", searchParams);
  //   return this.http.get(`${environment.apiUrl}/doctors/getByIdWeis`, {
  //     params,
  //   });
  // }

  getAllDoctorAppoinmentsById(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.get(
      `${environment.apiUrl}/patient_appointments/getDocAppById`,
      {
        params,
      }
    );
  }
  closeDoctorappointment(user) {
    return this.http.put(
      `${environment.apiUrl}/patient_appointments/update`,
      user
    );
  }

  update(user) {
    return this.http.put(`${environment.apiUrl}/doctors/update`, user);
  }
  doctorPasswordReset(user) {
    return this.http.put(`${environment.apiUrl}/doctors/resetPassword`, user);
  }

  hopitalPasswordUpdate(user) {
    return this.http.put(`${environment.apiUrl}/hospitals/update`, user);
  }

  updatePassword(user) {
    return this.http.put(`${environment.apiUrl}/doctors/changePassWord`, user);
  }

  updateSingle(id) {
    return this.http.put(`${environment.apiUrl}/doctors/sdelete`, { id: id });
  }

  updateAllStatus(id, flag) {
    return this.http.put(`${environment.apiUrl}/doctors/updateAllStatus`, {
      id: id,
      flag: flag,
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/doctors/${id}`);
  }

  public bookAppointment(data: any) {
    return this.http
      .post(`${environment.apiUrl}/patient_appointments/register`, data)
      .pipe(catchError(this.handleError));
  }

  updateDoctorAppointments(payload: any) {
    return this.http
      .put(`${environment.apiUrl}/doctors/update`, payload)
      .pipe(catchError(this.handleError));
  }
  public updatePatientFNE(data: any) {
    return this.http
      .put(`${environment.apiUrl}/patients/updateUserFNE`, data, {})
      .pipe(catchError(this.handleError));
  }
  getDoctorAppointments(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http
      .get(`${environment.apiUrl}/doctors/getUserAppointments`, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  clinicUserDoctorInfo(id: any) {
    return this.http
      .get<any>(`${environment.apiUrl}/doctors/getById/${id}`)
      .pipe(catchError(this.handleError));
  }
}
