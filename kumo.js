var hue_bridge=<%Hue bridge IP address%>;
var hue_user = <%Hue username%>;
var hue_lampids = <%Hue lamp IDs (separate by ,)%>;
[<#door sensors_[12|52|53]_N#>].forEach(
function (sensor) {
    sensor.opened = function () {
        hue_lampids.split(",").forEach(function(id){
            KumoApp.httpCall("http://"+hue_bridge+"/api/" + hue_user+"/lights/"+id+"/state", "PUT", 
            '{"hue": 50000,"on": true,"bri": 200}');
        });
    };
    sensor.closed = function () {
        hue_lampids.split(",").forEach(function(id){
            KumoApp.httpCall("http://"+hue_bridge+"/api/" + hue_user+"/lights/"+id+"/state", "PUT", 
            '{"on": false}');
        });
    }
});

[<#Reed Sensor_[52]_N#>].forEach(
function (sensor) {
    sensor.opened = function () {
            KumoApp.httpCallExternal("http://file.harris.io:8081/api/bathrooms"+sensor.uuid, "PUT", 
            '{"name":'+sensor.name+',"isOccupied": false}');
    };
    sensor.closed = function () {
            KumoApp.httpCallExternal("http://file.harris.io:8081/api/bathrooms"+sensor.uuid, "PUT", 
            '{"name":'+sensor.name+',"isOccupied": true}');
    };
});

