'use strict';
angular.module('core').controller('eSignController', eSignController);
eSignController.$inject = ['$scope', '$state', '$modal', 'Authentication', '$http', 'FileUploader'];

function eSignController($scope, $state, $modal, Authentication, $http, FileUploader) {
    $scope.finalUrl = {};
    $scope.uploader = new FileUploader({
        url: 'api/esigndoc',
    });

    $scope.load = function () {
        console.log($scope.choices);
        for (var i = 0; i < $scope.choices.length; i++) {
            console.log($scope.choices[i]);
            $scope.email1 = $scope.choices[i].email;
            $scope.name1 = $scope.choices[i].name;

        }
    }

    $scope.uploadFile = function (input) {
        console.log(input.files[0]);
        $scope.post = input.files[0];

    };

    $scope.upload = function (file) {
       
        $scope.uploader.onBeforeUploadItem = function (fileItem) {
           alert("File Item is "+fileItem);
            var data4 = JSON.stringify($scope.choices);
            fileItem.formData.push({ "invitee": data4 });
            console.log(data4);
        };
        $scope.uploader.uploadAll();
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.success = "File uploaded successfully";

            alert("Great !!! Document is initiated for e-signed and mailed to you.Please check your mail to find the link and proceed further");
            
            // var data = JSON.stringify(response);
            // var data1 = JSON.parse(data);
            // var data2 = JSON.stringify(JSON.parse(data1.body).data);
            // var data3 = (JSON.stringify(JSON.parse(data2).requests));
            // console.log(JSON.parse(data3)[0].signUrl);
            // $scope.finalUrl = JSON.parse(data3)[0].signUrl;
        }
    };


    // Dynamic data binding 


    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };

    $scope.removeChoice = function () {
        var lastItem = $scope.choices.length - 1;
        $scope.choices.splice(lastItem);
    };


    //document upload add receiver
    $scope.addReceiver = function (number, index) {
        var myEl = angular.element(document.querySelector('#target'));
        myEl.append('<div id="invite" class="selfsign_box"> <div class="row" style="padding:10px;"> <div class="col-md-1"> </div> <div class="col-md-3"> <input type="text" class="form-control ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-required" placeholder="Enter invitee name" required=""> </div>  <div class="col-md-3"> <input type="email" class="form-control ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-required ng-valid-email" placeholder="Enter invitee email" required=""> </div> <div class="col-md-3"> <div class="dropdown"> <select class="form-control ng-pristine ng-untouched ng-valid ng-empty" style="margin-left:20px;"> <option value="" selected="selected"> Requied Documents</option> <option label="Proof of Authorized Signatory" value="string:AS">Proof of Authorized Signatory</option>  <option label="Bank Cheque" value="string:BC">Bank Cheque</option> <option label="Photo" value="string:PHT">Photo</option> <option label="Others" value="string:OTH">Others</option> </select> </div> </div>  <div class="col-md-2"> <button type="button" class="btn btn-box-tool" id="close-div"  style="background-color:white;"> <i class="glyphicon glyphicon-trash error" title="Click to delete"></i> </button> </div> </div> </div>');
    }

    // document library (supporting documents popup)
    $scope.open = function () {
        console.log('opening pop up');
        var modalInstance = $modal.open({
            templateUrl: 'modules/core/client/views/supDocs.client.view.html',
            controller: 'eSignController',
        });
    }

    //documents
    $scope.docList = function () {
        console.log('opening pop up');
        var modalInstance = $modal.open({
            templateUrl: 'modules/core/client/views/supDocsList.client.list.html',
            controller: 'eSignController',
        });
    }

    //preview
    $scope.preview = function () {
        console.log('opening pop up');
        var modalInstance = $modal.open({
            templateUrl: 'modules/core/client/views/preview.client.view.html',
            controller: 'eSignController',
        });
    }
}