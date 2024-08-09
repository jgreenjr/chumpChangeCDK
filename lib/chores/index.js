exports.handler = async (event, context) => {
        console.log("Event: ", event, "Context", context);
    
        let method = event.requestContext.http.method;
    
        console.log("method", method)
        let getResponse = {
            name:"charlie",
            total: 200,
            chores:[
                {
                    activity:"cleaning potty",
                    date: "2024-08-02",
                    amount: 2.00,
                    createdBy: "Dad",
                    notes: "Charlotte cleaned the bathroom when everyone was coming over"
                },
                {
                    activity:"sweetping",
                    date: "2024-08-02",
                    amount: 1.00,
                    createdBy: "mom",
                    notes: "Charlotte cleaned the floor when everyone was coming over"
                },
            ]
        };
        switch (method){
            case "GET":
                console.log("getting")
                const response = {
                    statusCode: 200,
                    body: getResponse,
                };
                return response;
            default:
                return {
                    statusCode:400,
                    body: JSON.stringify("Unsupported Method:", event)
                }
        }
    };
    
    