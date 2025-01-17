import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filteredUsers',
  standalone: true
})
export class FilteredUsersPipe implements PipeTransform {

  transform(participants : string[], loggedInUser : string): unknown {
    return participants.filter(participant => participant !== loggedInUser)
  }

}
