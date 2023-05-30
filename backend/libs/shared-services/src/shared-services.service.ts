import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedServicesService {

    public test(msg: string) {
        console.log('Hello shared', msg);
    }
}
