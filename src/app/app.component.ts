import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'hot-cold-obv';
    /**
     * 1. Cold observables start to emit values only when we subscribe to them.
     *    Hot ones emit always - fromEvent(), RxJs Subjects, Some opertors: share(), shareReplay()
     *
     * 2. Cold observables are unicast, and
     *    Hot observables are multicast (share value between multiple subscirbers)
     *
     * 3. For Hot observables data source is created and activated outside of observables.
     *    For Cold ones - inside
    */

    post$!: Observable<any[]>;

    constructor(private _httpclient: HttpClient) { }

    ngOnInit(): void {
        // Cold Obsevable
        console.log('Cold Observable');
        const coldObs$ = of([]).pipe(map(() => Math.random()));

        coldObs$.subscribe(console.log);
        coldObs$.subscribe(console.log);
        coldObs$.subscribe(console.log);

        // Hot Observable
        console.log('Hot Observable');
        const hotObs$ = fromTimestamp();
        hotObs$.subscribe(console.log)
        setTimeout(() => {
            hotObs$.subscribe(console.log)
        }, 2000);

        // making observables as hot - so that it makes only one api call and share the result with async
        // in html we have made 2 async, means this api is called two times
        // using shareReplay(), we'll be able to make one api call and share the obs to all
        this.post$ = this._httpclient.get<any[]>(`https://jsonplaceholder.typicode.com/posts`)
            .pipe(shareReplay());
    }
}

const fromTimestamp = (): Observable<number> => {
    const timestamp = Date.now(); // hot - broacasting to every subscriber
    return new Observable((subscriber) => {
        // const timestamp = Date.now(); // still a cold observable
        subscriber.next(timestamp)
    });
}
