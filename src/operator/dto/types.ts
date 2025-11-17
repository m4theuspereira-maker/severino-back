import { UpdateUser } from "src/user/dto/types";
import { OperatorClass } from "src/@common/enums/operator-class.enum";


export class FindOperator {
    userId?: number;
    class?: OperatorClass;
    teamId?: number;
    isFirstTime?: boolean;
}
export class UpdateOperator {
    class?: OperatorClass;
    teamId?: number;
    isFirstTime?: boolean;
    participationDays?: string;
    coments?: string;
    user?: UpdateUser;
}
export class SelectOperatorFields {
    userId?: boolean;
    class?: boolean;
    isFirstTime?: boolean;
    participationDays?: boolean;
    coments?: boolean;
    team?: {
        select?: {
            id?: boolean;
            name?: boolean;
            tag?: boolean;
        };
    };
    user?: {
        select?: {
            id?: boolean;
            email?: boolean;
            name?: boolean;
            phone?: boolean;
            city?: boolean;
            state?: boolean;
        };
    };

}