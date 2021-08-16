public with sharing class RegistrationController {
    
    @AuraEnabled
    public static boolean ValidateRegistration(String registrationCode) {
        List<Meetup__c> meetUp = [select id from Meetup__c where RegistrationCode__c=:registrationCode];
        if(meetUp != null && meetUp.size() > 0)
        {
            return true;
        }
        return false;
    }
    @AuraEnabled
    public static void SaveRegistration(String firstName, String lastName, String email, String registrationCode) {
        List<Meetup__c> meetUp = [select id from Meetup__c where RegistrationCode__c=:registrationCode];
        if(meetUp == null || meetUp.size() == 0)
        {
            CustomException ex = new CustomException();
            ex.setMessage('Invalid Registration code.');
            throw ex;
           
        }
        MeetupRegistration__c reg = new MeetupRegistration__c();
        reg.FirstName__c = firstName;
        reg.LastName__c = lastName;
        reg.Email__c = email;
        reg.Meetup__c = meetUp[0].Id;
        insert reg;
        
    }

    public class CustomException extends Exception  {}

}
