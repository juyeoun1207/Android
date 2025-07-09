import { queryClient } from "../index"

const invalidQuery = ({queryKey = [], predicate}) => {
    let query = {}
    if(queryKey?.length >= 1){
        query.queryKey = queryKey
    }
    if(predicate){
        query.predicate = predicate
    }
    if(Object.keys(query)?.length >= 1){
        queryClient.invalidateQueries(
            query,
        );
        return;
    }
    else{
        return null;
    }
}

export default invalidQuery