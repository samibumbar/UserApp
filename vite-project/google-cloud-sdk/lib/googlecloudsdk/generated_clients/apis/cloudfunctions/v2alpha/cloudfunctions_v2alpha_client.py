"""Generated client library for cloudfunctions version v2alpha."""
# NOTE: This file is autogenerated and should not be edited by hand.

from __future__ import absolute_import

from apitools.base.py import base_api
from googlecloudsdk.generated_clients.apis.cloudfunctions.v2alpha import cloudfunctions_v2alpha_messages as messages


class CloudfunctionsV2alpha(base_api.BaseApiClient):
  """Generated client library for service cloudfunctions version v2alpha."""

  MESSAGES_MODULE = messages
  BASE_URL = 'https://cloudfunctions.googleapis.com/'
  MTLS_BASE_URL = 'https://cloudfunctions.mtls.googleapis.com/'

  _PACKAGE = 'cloudfunctions'
  _SCOPES = ['https://www.googleapis.com/auth/cloud-platform']
  _VERSION = 'v2alpha'
  _CLIENT_ID = 'CLIENT_ID'
  _CLIENT_SECRET = 'CLIENT_SECRET'
  _USER_AGENT = 'google-cloud-sdk'
  _CLIENT_CLASS_NAME = 'CloudfunctionsV2alpha'
  _URL_VERSION = 'v2alpha'
  _API_KEY = None

  def __init__(self, url='', credentials=None,
               get_credentials=True, http=None, model=None,
               log_request=False, log_response=False,
               credentials_args=None, default_global_params=None,
               additional_http_headers=None, response_encoding=None):
    """Create a new cloudfunctions handle."""
    url = url or self.BASE_URL
    super(CloudfunctionsV2alpha, self).__init__(
        url, credentials=credentials,
        get_credentials=get_credentials, http=http, model=model,
        log_request=log_request, log_response=log_response,
        credentials_args=credentials_args,
        default_global_params=default_global_params,
        additional_http_headers=additional_http_headers,
        response_encoding=response_encoding)
    self.projects_locations_functions = self.ProjectsLocationsFunctionsService(self)
    self.projects_locations_operations = self.ProjectsLocationsOperationsService(self)
    self.projects_locations_runtimes = self.ProjectsLocationsRuntimesService(self)
    self.projects_locations = self.ProjectsLocationsService(self)
    self.projects = self.ProjectsService(self)

  class ProjectsLocationsFunctionsService(base_api.BaseApiService):
    """Service class for the projects_locations_functions resource."""

    _NAME = 'projects_locations_functions'

    def __init__(self, client):
      super(CloudfunctionsV2alpha.ProjectsLocationsFunctionsService, self).__init__(client)
      self._upload_configs = {
          }

    def AbortFunctionUpgrade(self, request, global_params=None):
      r"""Aborts generation upgrade process for a function with the given name from the specified project. Deletes all 2nd Gen copy related configuration and resources which were created during the upgrade process.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsAbortFunctionUpgradeRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('AbortFunctionUpgrade')
      return self._RunMethod(
          config, request, global_params=global_params)

    AbortFunctionUpgrade.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:abortFunctionUpgrade',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.abortFunctionUpgrade',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:abortFunctionUpgrade',
        request_field='abortFunctionUpgradeRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsAbortFunctionUpgradeRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def CommitFunctionUpgrade(self, request, global_params=None):
      r"""Finalizes the upgrade after which function upgrade can not be rolled back. This is the last step of the multi step process to upgrade 1st Gen functions to 2nd Gen. Deletes all original 1st Gen related configuration and resources.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsCommitFunctionUpgradeRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('CommitFunctionUpgrade')
      return self._RunMethod(
          config, request, global_params=global_params)

    CommitFunctionUpgrade.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:commitFunctionUpgrade',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.commitFunctionUpgrade',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:commitFunctionUpgrade',
        request_field='commitFunctionUpgradeRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsCommitFunctionUpgradeRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def Create(self, request, global_params=None):
      r"""Creates a new function. If a function with the given name already exists in the specified project, the long running operation will return `ALREADY_EXISTS` error.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsCreateRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Create')
      return self._RunMethod(
          config, request, global_params=global_params)

    Create.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.create',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=['functionId'],
        relative_path='v2alpha/{+parent}/functions',
        request_field='function',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsCreateRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def Delete(self, request, global_params=None):
      r"""Deletes a function with the given name from the specified project. If the given function is used by some trigger, the trigger will be updated to remove this function.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsDeleteRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Delete')
      return self._RunMethod(
          config, request, global_params=global_params)

    Delete.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}',
        http_method='DELETE',
        method_id='cloudfunctions.projects.locations.functions.delete',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsDeleteRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def GenerateDownloadUrl(self, request, global_params=None):
      r"""Returns a signed URL for downloading deployed function source code. The URL is only valid for a limited period and should be used within 30 minutes of generation. For more information about the signed URL usage see: https://cloud.google.com/storage/docs/access-control/signed-urls.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsGenerateDownloadUrlRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (GenerateDownloadUrlResponse) The response message.
      """
      config = self.GetMethodConfig('GenerateDownloadUrl')
      return self._RunMethod(
          config, request, global_params=global_params)

    GenerateDownloadUrl.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:generateDownloadUrl',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.generateDownloadUrl',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:generateDownloadUrl',
        request_field='generateDownloadUrlRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsGenerateDownloadUrlRequest',
        response_type_name='GenerateDownloadUrlResponse',
        supports_download=False,
    )

    def GenerateUploadUrl(self, request, global_params=None):
      r"""Returns a signed URL for uploading a function source code. For more information about the signed URL usage see: https://cloud.google.com/storage/docs/access-control/signed-urls. Once the function source code upload is complete, the used signed URL should be provided in CreateFunction or UpdateFunction request as a reference to the function source code. When uploading source code to the generated signed URL, please follow these restrictions: * Source file type should be a zip file. * No credentials should be attached - the signed URLs provide access to the target bucket using internal service identity; if credentials were attached, the identity from the credentials would be used, but that identity does not have permissions to upload files to the URL. When making a HTTP PUT request, these two headers need to be specified: * `content-type: application/zip` And this header SHOULD NOT be specified: * `Authorization: Bearer YOUR_TOKEN`.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsGenerateUploadUrlRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (GenerateUploadUrlResponse) The response message.
      """
      config = self.GetMethodConfig('GenerateUploadUrl')
      return self._RunMethod(
          config, request, global_params=global_params)

    GenerateUploadUrl.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions:generateUploadUrl',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.generateUploadUrl',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=[],
        relative_path='v2alpha/{+parent}/functions:generateUploadUrl',
        request_field='generateUploadUrlRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsGenerateUploadUrlRequest',
        response_type_name='GenerateUploadUrlResponse',
        supports_download=False,
    )

    def Get(self, request, global_params=None):
      r"""Returns a function with the given name from the requested project.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsGetRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Function) The response message.
      """
      config = self.GetMethodConfig('Get')
      return self._RunMethod(
          config, request, global_params=global_params)

    Get.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.functions.get',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsGetRequest',
        response_type_name='Function',
        supports_download=False,
    )

    def GetIamPolicy(self, request, global_params=None):
      r"""Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsGetIamPolicyRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Policy) The response message.
      """
      config = self.GetMethodConfig('GetIamPolicy')
      return self._RunMethod(
          config, request, global_params=global_params)

    GetIamPolicy.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:getIamPolicy',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.functions.getIamPolicy',
        ordered_params=['resource'],
        path_params=['resource'],
        query_params=['options_requestedPolicyVersion'],
        relative_path='v2alpha/{+resource}:getIamPolicy',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsGetIamPolicyRequest',
        response_type_name='Policy',
        supports_download=False,
    )

    def List(self, request, global_params=None):
      r"""Returns a list of functions that belong to the requested project.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListFunctionsResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.functions.list',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=['filter', 'orderBy', 'pageSize', 'pageToken'],
        relative_path='v2alpha/{+parent}/functions',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsListRequest',
        response_type_name='ListFunctionsResponse',
        supports_download=False,
    )

    def Patch(self, request, global_params=None):
      r"""Updates existing function.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsPatchRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Patch')
      return self._RunMethod(
          config, request, global_params=global_params)

    Patch.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}',
        http_method='PATCH',
        method_id='cloudfunctions.projects.locations.functions.patch',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['updateMask'],
        relative_path='v2alpha/{+name}',
        request_field='function',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsPatchRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def RedirectFunctionUpgradeTraffic(self, request, global_params=None):
      r"""Changes the traffic target of a function from the original 1st Gen function to the 2nd Gen copy. This is the second step of the multi step process to upgrade 1st Gen functions to 2nd Gen. After this operation, all new traffic will be served by 2nd Gen copy.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsRedirectFunctionUpgradeTrafficRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('RedirectFunctionUpgradeTraffic')
      return self._RunMethod(
          config, request, global_params=global_params)

    RedirectFunctionUpgradeTraffic.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:redirectFunctionUpgradeTraffic',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.redirectFunctionUpgradeTraffic',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:redirectFunctionUpgradeTraffic',
        request_field='redirectFunctionUpgradeTrafficRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsRedirectFunctionUpgradeTrafficRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def RollbackFunctionUpgradeTraffic(self, request, global_params=None):
      r"""Reverts the traffic target of a function from the 2nd Gen copy to the original 1st Gen function. After this operation, all new traffic would be served by the 1st Gen.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsRollbackFunctionUpgradeTrafficRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('RollbackFunctionUpgradeTraffic')
      return self._RunMethod(
          config, request, global_params=global_params)

    RollbackFunctionUpgradeTraffic.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:rollbackFunctionUpgradeTraffic',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.rollbackFunctionUpgradeTraffic',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:rollbackFunctionUpgradeTraffic',
        request_field='rollbackFunctionUpgradeTrafficRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsRollbackFunctionUpgradeTrafficRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def SetIamPolicy(self, request, global_params=None):
      r"""Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsSetIamPolicyRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Policy) The response message.
      """
      config = self.GetMethodConfig('SetIamPolicy')
      return self._RunMethod(
          config, request, global_params=global_params)

    SetIamPolicy.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:setIamPolicy',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.setIamPolicy',
        ordered_params=['resource'],
        path_params=['resource'],
        query_params=[],
        relative_path='v2alpha/{+resource}:setIamPolicy',
        request_field='setIamPolicyRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsSetIamPolicyRequest',
        response_type_name='Policy',
        supports_download=False,
    )

    def SetupFunctionUpgradeConfig(self, request, global_params=None):
      r"""Creates a 2nd Gen copy of the function configuration based on the 1st Gen function with the given name. This is the first step of the multi step process to upgrade 1st Gen functions to 2nd Gen. Only 2nd Gen configuration is setup as part of this request and traffic continues to be served by 1st Gen.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsSetupFunctionUpgradeConfigRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('SetupFunctionUpgradeConfig')
      return self._RunMethod(
          config, request, global_params=global_params)

    SetupFunctionUpgradeConfig.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:setupFunctionUpgradeConfig',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.setupFunctionUpgradeConfig',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}:setupFunctionUpgradeConfig',
        request_field='setupFunctionUpgradeConfigRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsSetupFunctionUpgradeConfigRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def TestIamPermissions(self, request, global_params=None):
      r"""Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.

      Args:
        request: (CloudfunctionsProjectsLocationsFunctionsTestIamPermissionsRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (TestIamPermissionsResponse) The response message.
      """
      config = self.GetMethodConfig('TestIamPermissions')
      return self._RunMethod(
          config, request, global_params=global_params)

    TestIamPermissions.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/functions/{functionsId}:testIamPermissions',
        http_method='POST',
        method_id='cloudfunctions.projects.locations.functions.testIamPermissions',
        ordered_params=['resource'],
        path_params=['resource'],
        query_params=[],
        relative_path='v2alpha/{+resource}:testIamPermissions',
        request_field='testIamPermissionsRequest',
        request_type_name='CloudfunctionsProjectsLocationsFunctionsTestIamPermissionsRequest',
        response_type_name='TestIamPermissionsResponse',
        supports_download=False,
    )

  class ProjectsLocationsOperationsService(base_api.BaseApiService):
    """Service class for the projects_locations_operations resource."""

    _NAME = 'projects_locations_operations'

    def __init__(self, client):
      super(CloudfunctionsV2alpha.ProjectsLocationsOperationsService, self).__init__(client)
      self._upload_configs = {
          }

    def Get(self, request, global_params=None):
      r"""Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.

      Args:
        request: (CloudfunctionsProjectsLocationsOperationsGetRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Get')
      return self._RunMethod(
          config, request, global_params=global_params)

    Get.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/operations/{operationsId}',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.operations.get',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2alpha/{+name}',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsOperationsGetRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def List(self, request, global_params=None):
      r"""Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding allows API services to override the binding to use different resource name schemes, such as `users/*/operations`. To override the binding, API services can add a binding such as `"/v1/{name=users/*}/operations"` to their service configuration. For backwards compatibility, the default name includes the operations collection id, however overriding users must ensure the name binding is the parent resource, without the operations collection id.

      Args:
        request: (CloudfunctionsProjectsLocationsOperationsListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListOperationsResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/operations',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.operations.list',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['filter', 'pageSize', 'pageToken'],
        relative_path='v2alpha/{+name}/operations',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsOperationsListRequest',
        response_type_name='ListOperationsResponse',
        supports_download=False,
    )

  class ProjectsLocationsRuntimesService(base_api.BaseApiService):
    """Service class for the projects_locations_runtimes resource."""

    _NAME = 'projects_locations_runtimes'

    def __init__(self, client):
      super(CloudfunctionsV2alpha.ProjectsLocationsRuntimesService, self).__init__(client)
      self._upload_configs = {
          }

    def List(self, request, global_params=None):
      r"""Returns a list of runtimes that are supported for the requested project.

      Args:
        request: (CloudfunctionsProjectsLocationsRuntimesListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListRuntimesResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations/{locationsId}/runtimes',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.runtimes.list',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=['filter'],
        relative_path='v2alpha/{+parent}/runtimes',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsRuntimesListRequest',
        response_type_name='ListRuntimesResponse',
        supports_download=False,
    )

  class ProjectsLocationsService(base_api.BaseApiService):
    """Service class for the projects_locations resource."""

    _NAME = 'projects_locations'

    def __init__(self, client):
      super(CloudfunctionsV2alpha.ProjectsLocationsService, self).__init__(client)
      self._upload_configs = {
          }

    def List(self, request, global_params=None):
      r"""Lists information about the supported locations for this service.

      Args:
        request: (CloudfunctionsProjectsLocationsListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListLocationsResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2alpha/projects/{projectsId}/locations',
        http_method='GET',
        method_id='cloudfunctions.projects.locations.list',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['filter', 'pageSize', 'pageToken'],
        relative_path='v2alpha/{+name}/locations',
        request_field='',
        request_type_name='CloudfunctionsProjectsLocationsListRequest',
        response_type_name='ListLocationsResponse',
        supports_download=False,
    )

  class ProjectsService(base_api.BaseApiService):
    """Service class for the projects resource."""

    _NAME = 'projects'

    def __init__(self, client):
      super(CloudfunctionsV2alpha.ProjectsService, self).__init__(client)
      self._upload_configs = {
          }
