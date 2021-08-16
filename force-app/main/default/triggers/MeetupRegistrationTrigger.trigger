trigger MeetupRegistrationTrigger on MeetupRegistration__c (before insert) {
    if(Trigger.isInsert && Trigger.isBefore)
    {
        Set<Id> setMeetup = new Set<Id>();
        for(MeetupRegistration__c reg : Trigger.New )
        {
            setMeetup.add(reg.Meetup__c);
        }
        List<Meetup__c> listMeetups = [select id,Total_Registrations__c,RegistrationLimit__c  from Meetup__c where Id =: setMeetup];
        Map<Id, boolean> mapMeetInvalid = new Map<Id, boolean>();
        for(Meetup__c meet : listMeetups)
        {
            if(meet.Total_Registrations__c >= meet.RegistrationLimit__c) {
                mapMeetInvalid.put(meet.Id, false);
            }
        }
        for(MeetupRegistration__c reg : Trigger.New)
        {
            if(mapMeetInvalid.get(reg.Meetup__c) != null)
            {
                reg.addError('Total Registrants exceeded.');
            }
        }
    }
}