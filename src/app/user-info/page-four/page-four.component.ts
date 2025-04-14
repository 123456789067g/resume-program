import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { AuthService } from '../../services/auth.service';

countries.registerLocale(enLocale);

@Component({
  selector: "app-page-four",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./page-four.component.html",
  styleUrls: ["./page-four.component.css"],
})
export class PageFourComponent implements OnInit {
  form!: FormGroup;
  showError: boolean = false;
  nationalities: string[] = []; // 存储选中的国家  
  countries: { [key: string]: string } = countries.getNames("en");
  countryOptions: { code: string, name: string }[] = Object.entries(this.countries).map(([code, name]) => ({
    code,
    name,
  }));
  militaryBranches: string[] = [
    "Navy",
    "AF",
    "Army",
    "NG",
    "Reserves",
    "Marine",
    "CG",
    "SF",
    "USSF",
  ]; // 军队分支选项
  races: string[] = [
    "amcInd",
    "aisa",
    "black",
    "hispanic",
    "hawaiian",
    "white",
    "na",
  ]; // 种族选项
  genders: string[] = [
    "man",
    "woman",
    "non-binary",
    "intersex",
    "two-spirit",
    "gender-non-conforming",
    "transgender",
    "not answer",
  ];
  governmentOptions: string[] = ["no", "current", "former"];
  veteranOptions: string[] = ["yes", "no", "not answer"];


  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      willingToRelocate: ["", Validators.required],
      competitionAgreements: ["", Validators.required],
      ncaCompanies: [""],
      usCitizen: ["", Validators.required],
      authorizedToWork: [""],
      sponsorship: [""],
      nationality: [""],
      governmentEmployee: ["", Validators.required],
      gender: ["", Validators.required],
      race: ["", Validators.required],
      inService: ["", Validators.required],
      veteranStatus: [""],
      militarySpouse: [""],
      militaryBranch: [""],
    }
    );

    if (typeof window !== "undefined" && window.sessionStorage) {
      const savedData = sessionStorage.getItem("pageFour");
      if (savedData) {
        this.form.patchValue(JSON.parse(savedData));
      }
    }

    this.form.get("competitionAgreements")?.valueChanges.subscribe((value) => {
      this.form
        .get("ncaCompanies")
        ?.setValidators(value === "yes" ? Validators.required : null);
      this.form.get("ncaCompanies")?.updateValueAndValidity();
    });

    this.form.get("usCitizen")?.valueChanges.subscribe((value) => {
      if (value === "no") {
        this.form.get("authorizedToWork")?.setValidators(Validators.required);
        this.form.get("sponsorship")?.setValidators(Validators.required);
        this.form.get("nationality")?.setValidators(Validators.required);
      } else {
        this.form.get("authorizedToWork")?.clearValidators();
        this.form.get("sponsorship")?.clearValidators();
        this.form.get("nationality")?.clearValidators();
      }
      this.form.get("authorizedToWork")?.updateValueAndValidity();
      this.form.get("sponsorship")?.updateValueAndValidity();
      this.form.get("nationality")?.updateValueAndValidity();
    });

    this.form.get("inService")?.valueChanges.subscribe((value) => {
      if (value === "no") {
        this.form.get("veteranStatus")?.setValidators(Validators.required);
        this.form.get("militarySpouse")?.setValidators(Validators.required);
        this.form.get("militaryBranch")?.clearValidators();
      } else {
        this.form.get("veteranStatus")?.clearValidators();
        this.form.get("militarySpouse")?.clearValidators();
        this.form.get("militaryBranch")?.setValidators(Validators.required);
      }
      this.form.get("veteranStatus")?.updateValueAndValidity();
      this.form.get("militarySpouse")?.updateValueAndValidity();
      this.form.get("militaryBranch")?.updateValueAndValidity();
    });
  }

  addNationality(event: any): void {
    const selectedCountry = event.target.value;
    if (selectedCountry && !this.nationalities.includes(selectedCountry)) {
      this.nationalities.push(selectedCountry);
      this.form.get("nationality")?.setValue(this.nationalities.join(", "));
    }
  }

  saveToDatabase(payload: object): void {
    const url = "https://ox1dk3bql1.execute-api.us-east-2.amazonaws.com/v1/";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        token: this.authService.getToken() || "",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log("Data saved to the database: ", data))
      .then(() => {
        console.log(payload);
        alert("Survey submitted successfully!");
        sessionStorage.removeItem("pageOne");
        sessionStorage.removeItem("pageTwo");
        sessionStorage.removeItem("pageThree");
        sessionStorage.removeItem("pageFour");
        this.router.navigate(["/"]);
      })
      .catch((error) =>
        console.error("Error saving data to the database: ", error)
      );
    return;
  }

  onPrevious(): void {
    this.router.navigate(["/user-info/page-three"]);
  }

  onSubmit(): void {
    if (this.form.valid) {
      sessionStorage.setItem("pageFour", JSON.stringify(this.form.value));
      const payload = Object.assign(
        {},
        JSON.parse(sessionStorage.getItem("pageOne") || "{}"),
        JSON.parse(sessionStorage.getItem("pageTwo") || "{}"),
        JSON.parse(sessionStorage.getItem("pageThree") || "{}"),
        JSON.parse(sessionStorage.getItem("pageFour") || "{}")
      );
      sessionStorage.setItem("surveyCompleted", "true");
      this.saveToDatabase(payload);
    } else {
      this.showError = true;
    }
  }
}
