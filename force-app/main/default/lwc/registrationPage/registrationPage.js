import { LightningElement, wire, track  } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import saveRegistration from '@salesforce/apex/RegistrationController.SaveRegistration';
import validateRegistration from '@salesforce/apex/RegistrationController.ValidateRegistration';

export default class RegistrationPage extends LightningElement {
    registrationCode;
    validRegistrationCode;
    FirstName = '';
    LastName = '';
    Email = '';
    connectedCallback(event) {
    }
    handleClick()
    {
        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if(isInputsCorrect)
        {
   
            saveRegistration({firstName: this.FirstName, lastName: this.LastName, email: this.Email, registrationCode: this.registrationCode}).then(result => {
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "Record saved successfully",
                    variant: "success",
                });
                this.dispatchEvent(evt);
                this.FirstName = "";
                this.Email = "";
                this.LastName = "";
            }).catch(error => {
                var message = '';
                if(error.body.pageErrors != undefined && error.body.pageErrors != null && error.body.pageErrors.length  > 0)
                {
                    message = error.body.pageErrors[0].message;
                }
                else {
                    message = error.body.message;
                }
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: message,
                    variant: "error",
                });
                this.dispatchEvent(evt);
            });
        }
    }
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        debugger;
        if (currentPageReference) {
            var state = currentPageReference.state;
            if(state)
            {
                this.registrationCode = state.c__coderegistration;
                if(this.registrationCode == undefined || this.registrationCode == null || this.registrationCode == '')
                {
                     const evt = new ShowToastEvent({
                         title: "Error",
                         message: "Registration code is missing",
                         variant: "error",
                     });
                     this.dispatchEvent(evt);
                     this.validRegistrationCode = false;
                }
                else{
                 validateRegistration({registrationCode: this.registrationCode}).then(result => {
                     this.validRegistrationCode = result;
                 }).catch(error => {
                     this.error = error;
                     this.accounts = undefined;
                 });
                }
            }
            else{
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "Registration code is missing",
                    variant: "error",
                });
                this.dispatchEvent(evt);
                this.validRegistrationCode = false;
            }
           
        }
    }

    handleFirstNameChange(event){
        this.FirstName = event.target.value;
    }
    handleLastNameChange(event){
        this.LastName = event.target.value;
    }
    handleEmailChange(event){
        this.Email = event.target.value;
    }
}
