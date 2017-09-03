var app = angular.module('app',[]);

app.controller('sampleController', function ($scope , $http){
  $http.post('/technologies').then(function(res){
    console.log(res);
    $scope.arr = res.data.data.result;
    for (var i = $scope.arr.length - 1; i >= 0; i--) {
      if ($scope.arr[i]._id == null) { delete $scope.arr[i]};
    };
  });

  $scope.hideTechList = false;
  $scope.hideRepoList = true;
  $scope.hideRepoListByUser = true;

  $scope.getRepos = function(lang){
    console.log("Getting Repos", lang);
    var data = {
      'data' : lang
    };

    $scope.selectedLanguage = lang._id;

    $http.post('/repos', data).then(function(res){
        console.log(JSON.parse(res.data.data));
        var arrRepo = JSON.parse(res.data.data);
        var unique = [];
        $scope.arrRepo = [];
        for (var i = 0; i < arrRepo.length; i++) {
          if (unique.indexOf(arrRepo[i].payload.pull_request.base.repo.full_name) != -1)continue;
          unique.push(arrRepo[i].payload.pull_request.base.repo.full_name);
          $scope.arrRepo.push(arrRepo[i]);
        };

        $scope.hideTechList = true;
        $scope.hideRepoList = false;
        $scope.hideRepoListByUser = true;
    }); 
  }

  $scope.reset = function(){
    console.log("done");
      $scope.hideTechList = false;
      $scope.hideRepoList = true;
      $scope.hideRepoListByUser = true;
  }

  $scope.getReposByUser = function(user){
    console.log("Getting Repos for user", user);
    $scope.selectedUser = user;
    user = user.login
    var data = {
      'data' : user
    };

    $http.post('/reposByUser', data).then(function(res){
        console.log(JSON.parse(res.data.data));

        var arrRepoByUser = JSON.parse(res.data.data);
        var unique = [];
        $scope.arrRepoByUser = [];
        for (var i = 0; i < arrRepoByUser.length; i++) {
          if (unique.indexOf(arrRepoByUser[i].payload.pull_request.base.repo.full_name) != -1)continue;
          unique.push(arrRepoByUser[i].payload.pull_request.base.repo.full_name);
          $scope.arrRepoByUser.push(arrRepoByUser[i]);
        };
        $scope.hideTechList = true;
        $scope.hideRepoList = true;
        $scope.hideRepoListByUser = false;
    }); 
  }
});