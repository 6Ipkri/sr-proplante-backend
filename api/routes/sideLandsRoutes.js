var express = require("express"); // เรียกใช้งาน express  mudule
var router = express.Router(); // กำหนด router instance ให้กับ express.Router class

// เราใช้คำสั่ง use() เพื่อเรียกใช้งาน middleware function
// middleware ที่กำงานใน router instance ก่อนเข้าไปทำงานใน route function
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.post("/polygon/main", (req, res, next) => {
  var docs = req.body;
  var centerLat = 0;
  var centerLng = 0;
  var countPoint = 0;
  var polygonLands = [];
  var fitBounds = [];
  for (let i = 0; i < docs.length; i++) {
    var latlngArr = [];
    var points = docs[i].land.points;
    centerLat = 0;
    centerLng = 0;
    countPoint = 0;
    for (let j = 0; j < points.length; j++) {
      var obj = {
        lat: points[j].lat,
        lng: points[j].lng
      };
      centerLat += points[j].lat;
      centerLng += points[j].lng;
      countPoint++;
      latlngArr.push(obj);
    }
    centerLat = centerLat / countPoint;
    centerLng = centerLng / countPoint;

    polygonLands.push({
      center: { lat: centerLat, lng: centerLng },
      land_id: docs[i].land._id,
      lat_lng: latlngArr
    });
  }

  var result = {
    polygonLands: polygonLands
  };
  res.status(200).send(result);
});

router.post("/filter", (req, res, next) => {
  var province = req.query.province;
  var district = req.query.district;
  var landName = req.query.landname;
  var plant = req.query.plant;
  var landsData = req.body.lands;
  var plantData = req.body.plants;

  var fDis = [];
  var fPro = [];
  var fName = [];
  var fPlant = [];

 landsData.find(function(value, index) {
  if(value.land.province == province || province == "all"){
    fPro.push(value)
  }
  if(value.land.district == district || district == "all"){
    fDis.push(value)
  }
    if(value.land.name.includes(landName) || landName == "all"){
      fName.push(value)
    }
    if(plant == "all"){
      fPlant.push(value)
    }else{
      plantData.find(function(v,i){
        if(v._id == value.operation.logs.plant_id && v.name == plant){
          fPlant.push(value)
        }
      })
    }

  });

  var arr = fDis.filter(value => fPro.includes(value))
  arr = arr.filter(value => fName.includes(value))
  arr = arr.filter(value => fPlant.includes(value))
console.log("------------")
  console.log(arr)
console.log("------------")
  res.status(200).send(arr);


  // var afFilters = [];
  // if (province != "all") {
  //   for (let i = 0; i < landsData.length; i++) {
  //     if (landsData[i].land.province == province) {
  //       afFilters.push(landsData[i]);
  //     }
  //   }
  // } else {
  //   afFilters = landsData;
  // }
  // if (district != "all") {
  //   var districtFilter = [];
  //   for (let i = 0; i < afFilters.length; i++) {
  //     if (afFilters[i].land.district == district) {
  //       districtFilter.push(afFilters[i]);
  //     }
  //   }
  //   afFilters = districtFilter;
  // }

  // if (plant != "all") {
  //   for (let j = 0; j < plantData.length; j++) {
  //     if (plantData[j].name == plant) {
  //       plant = plantData[j]._id;
  //       break;
  //     }
  //   }
  //   var plantFilter = [];
  //   for (let i = 0; i < afFilters.length; i++) {
  //     if (afFilters[i].operation.logs.plant_id == plant) {
  //       plantFilter.push(afFilters[i]);
  //     }
  //   }
  //   afFilters = plantFilter;
  // } else {
  //   afFilters = plantData;
  // }
  // if (landName != "all") {
  //   for (let i = 0; i < landsData.length; i++) {
  //     if (landsData[i].land.name == landName) {
  //       afFilters.push(landsData[i]);
  //     }
  //   }
  // } else {
  //   afFilters = landsData;
  // }

  // console.log(afFilters)

  // res.status(200).send(afFilters);
});

module.exports = router;
