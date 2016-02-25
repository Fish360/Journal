(function(){
    f360.factory("ReportsService", ReportsService);
    function ReportsService ($http) {
        var model = {
            reports: [
                {_id: "123asd", name: "Report 1", type: "timeOfYear",
                    data: [
                        {label: "JAN", value: 10},
                        {label: "FEB", value: 20},
                        {label: "MAR", value: 30},
                        {label: "APR", value: 40},
                        {label: "MAY", value: 50},
                        {label: "JUN", value: 60},
                        {label: "JUL", value: 70},
                        {label: "AUG", value: 80},
                        {label: "SEP", value: 70},
                        {label: "OCT", value: 60},
                        {label: "NOV", value: 50},
                        {label: "DEC", value: 40}
                    ]
                },
                {_id: "234asd", name: "Report 2", type: "spots",
                    data: [
                        {label: "Death Rock",   value: 70},
                        {label: "Herring Run",  value: 60},
                        {label: "Dories Cove",  value: 50},
                        {label: "Black Rock",   value: 40},
                        {label: "Murder's Row", value: 30},
                        {label: "Cocunuts",     value: 20},
                        {label: "Park 7",       value: 10}
                    ]
                },
                {_id: "345asd", name: "Report 3", type: "presentations",
                    data: [
                        {label: "Eel", value: 80},
                        {label: "Manhaden", value: 70},
                        {label: "Bucktail", value: 60},
                        {label: "Lefty Deceiver", value: 50},
                        {label: "Swim Sahd", value: 40},
                        {label: "Sea Worm", value: 30},
                        {label: "Kastmaster", value: 20}
                    ]
                }
            ],
            createReport: createReport,
            findAllReports: findAllReports,
            findReportById: findReportById,
            findReportsByUsername: findReportsByUsername,
            runReportById: runReportById,
            deleteReport: deleteReport,
            updateReport: updateReport
        };
        return model;

        function createReport (username, report) {
            return $http.post ("/api/"+username+"/report", report);
        }

        function runReportById (reportId) {
            return $http.get ("/api/report/"+reportId+"/run");
        }

        function findAllReports () {
            return $http.get ("/api/report");
        }

        function findReportById (reportId) {
            return $http.get ("/api/report/"+reportId);
        }

        function findReportsByUsername (username) {
            return $http.get ("/api/"+username+"/report");
        }

        function updateReport (report) {
            return $http.put ("/api/report/"+report._id, report);
        }

        function deleteReport (report) {
            return $http.delete ("/api/report/"+report._id);
        }
    }
})();