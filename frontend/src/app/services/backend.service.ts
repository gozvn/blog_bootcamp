import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { Observable } from "rxjs";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class BackendService {

    private backendServer = environment.backendServer // load enviroment backendServer  = URL

    constructor(private http: HttpClient) { 
        // console.log(this.backendServer); // print backendServer
    }

    _buildUrl( path:string){

        // const port = this.backendServer.port;
        const host = this.backendServer.host;
        const prefix = this.backendServer.prefix;
        const ssl = this.backendServer.ssl;
        let port = "";
        let protocol = 'http://';
        if(ssl === true){
            port = ":443";
            protocol = 'https://';
        }
        const url = `${protocol}${host}${port}${prefix}/${path}`;
        // console.log('URL:', url);
        return url;
    }
    get (path:string, options: any = {}):Observable<any>{

        options = options || {};
        options.headers = options.headers || {};

        return this.http.get<any>(this._buildUrl(path), options);
    }

    post (path:string, body?: any, options: any = {}):Observable<any>{

        options = options || {};
        options.headers = options.headers || {};
        body = body || {};

        return this.http.post<any>(this._buildUrl(path), body, options);
    }

    put (path:string, body?: any, options: any = {}):Observable<any>{

        options = options || {};
        options.headers = options.headers || {};
        body = body || {};

        return this.http.put<any>(this._buildUrl(path), body, options);
    }

    delete (path:string, options: any = {}):Observable<any>{

        options = options || {};
        options.headers = options.headers || {};

        return this.http.delete<any>(this._buildUrl(path), options);
    }

    postFile (path:string, body?: any, options: any = {}):Observable<any>{

        options = options || {};
        options.headers = options.headers || {};
        body = body || {};

        return this.http.post<any>(this._buildUrl(path), body, options);
    }

}

