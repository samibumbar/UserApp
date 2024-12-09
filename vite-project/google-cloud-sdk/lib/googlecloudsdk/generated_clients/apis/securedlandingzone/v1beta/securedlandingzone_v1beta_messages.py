"""Generated message classes for securedlandingzone version v1beta.

"""
# NOTE: This file is autogenerated and should not be edited by hand.

from __future__ import absolute_import

from apitools.base.protorpclite import messages as _messages
from apitools.base.py import encoding
from apitools.base.py import extra_types


package = 'securedlandingzone'


class GoogleCloudSecuredlandingzoneV1betaActivateOverwatchRequest(_messages.Message):
  r"""The request message for activating an Overwatch resource."""


class GoogleCloudSecuredlandingzoneV1betaListOverwatchesResponse(_messages.Message):
  r"""The response message for ListOverwatch.

  Fields:
    nextPageToken: A pagination token to retrieve the next page of results, or
      empty if there are no more results.
    overwatches: List of Overwatch resources under the specified parent in the
      request.
  """

  nextPageToken = _messages.StringField(1)
  overwatches = _messages.MessageField('GoogleCloudSecuredlandingzoneV1betaOverwatch', 2, repeated=True)


class GoogleCloudSecuredlandingzoneV1betaOverwatch(_messages.Message):
  r"""The Overwatch resource which holds all metadata related to an Overwatch
  instance.

  Enums:
    StateValueValuesEnum: Output only. The operation state of Overwatch
      resource that decides if response actions will be taken upon receiving
      drift or threat signals. This field is mutable by using the
      ActivateOverwatch or SuspendOverwatch actions.

  Fields:
    createTime: Output only. Creation time.
    name: Output only. The name of this Overwatch resource, in the format of
      organizations/{org_id}/locations/{location_id}/overwatches/{overwatch_id
      }.
    planData: Input only. The terraform plan file passed as bytes.
    remediationServiceAccount: Output only. This service account will be used
      by the Overwatch service for remediating drifts.
    state: Output only. The operation state of Overwatch resource that decides
      if response actions will be taken upon receiving drift or threat
      signals. This field is mutable by using the ActivateOverwatch or
      SuspendOverwatch actions.
    updateTime: Output only. Update time.
  """

  class StateValueValuesEnum(_messages.Enum):
    r"""Output only. The operation state of Overwatch resource that decides if
    response actions will be taken upon receiving drift or threat signals.
    This field is mutable by using the ActivateOverwatch or SuspendOverwatch
    actions.

    Values:
      STATE_UNSPECIFIED: Unspecified operation state.
      SUSPENDED: The Overwatch resource is suspended and no response actions
        are taken.
      ACTIVE: The Overwatch resource is active, and response actions will be
        taken based on the policies, when signals are received. This is the
        normal operating state.
      CREATING: The Overwatch resource is being created and not yet active.
      DELETING: The Overwatch resource is in the process of being deleted.
      UPDATING: The Overwatch resource's blueprint state is being updated.
    """
    STATE_UNSPECIFIED = 0
    SUSPENDED = 1
    ACTIVE = 2
    CREATING = 3
    DELETING = 4
    UPDATING = 5

  createTime = _messages.StringField(1)
  name = _messages.StringField(2)
  planData = _messages.BytesField(3)
  remediationServiceAccount = _messages.StringField(4)
  state = _messages.EnumField('StateValueValuesEnum', 5)
  updateTime = _messages.StringField(6)


class GoogleCloudSecuredlandingzoneV1betaSuspendOverwatchRequest(_messages.Message):
  r"""The request message for suspending an Overwatch resource."""


class GoogleLongrunningOperation(_messages.Message):
  r"""This resource represents a long-running operation that is the result of
  a network API call.

  Messages:
    MetadataValue: Service-specific metadata associated with the operation. It
      typically contains progress information and common metadata such as
      create time. Some services might not provide such metadata. Any method
      that returns a long-running operation should document the metadata type,
      if any.
    ResponseValue: The normal response of the operation in case of success. If
      the original method returns no data on success, such as `Delete`, the
      response is `google.protobuf.Empty`. If the original method is standard
      `Get`/`Create`/`Update`, the response should be the resource. For other
      methods, the response should have the type `XxxResponse`, where `Xxx` is
      the original method name. For example, if the original method name is
      `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.

  Fields:
    done: If the value is `false`, it means the operation is still in
      progress. If `true`, the operation is completed, and either `error` or
      `response` is available.
    error: The error result of the operation in case of failure or
      cancellation.
    metadata: Service-specific metadata associated with the operation. It
      typically contains progress information and common metadata such as
      create time. Some services might not provide such metadata. Any method
      that returns a long-running operation should document the metadata type,
      if any.
    name: The server-assigned name, which is only unique within the same
      service that originally returns it. If you use the default HTTP mapping,
      the `name` should be a resource name ending with
      `operations/{unique_id}`.
    response: The normal response of the operation in case of success. If the
      original method returns no data on success, such as `Delete`, the
      response is `google.protobuf.Empty`. If the original method is standard
      `Get`/`Create`/`Update`, the response should be the resource. For other
      methods, the response should have the type `XxxResponse`, where `Xxx` is
      the original method name. For example, if the original method name is
      `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
  """

  @encoding.MapUnrecognizedFields('additionalProperties')
  class MetadataValue(_messages.Message):
    r"""Service-specific metadata associated with the operation. It typically
    contains progress information and common metadata such as create time.
    Some services might not provide such metadata. Any method that returns a
    long-running operation should document the metadata type, if any.

    Messages:
      AdditionalProperty: An additional property for a MetadataValue object.

    Fields:
      additionalProperties: Properties of the object. Contains field @type
        with type URL.
    """

    class AdditionalProperty(_messages.Message):
      r"""An additional property for a MetadataValue object.

      Fields:
        key: Name of the additional property.
        value: A extra_types.JsonValue attribute.
      """

      key = _messages.StringField(1)
      value = _messages.MessageField('extra_types.JsonValue', 2)

    additionalProperties = _messages.MessageField('AdditionalProperty', 1, repeated=True)

  @encoding.MapUnrecognizedFields('additionalProperties')
  class ResponseValue(_messages.Message):
    r"""The normal response of the operation in case of success. If the
    original method returns no data on success, such as `Delete`, the response
    is `google.protobuf.Empty`. If the original method is standard
    `Get`/`Create`/`Update`, the response should be the resource. For other
    methods, the response should have the type `XxxResponse`, where `Xxx` is
    the original method name. For example, if the original method name is
    `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.

    Messages:
      AdditionalProperty: An additional property for a ResponseValue object.

    Fields:
      additionalProperties: Properties of the object. Contains field @type
        with type URL.
    """

    class AdditionalProperty(_messages.Message):
      r"""An additional property for a ResponseValue object.

      Fields:
        key: Name of the additional property.
        value: A extra_types.JsonValue attribute.
      """

      key = _messages.StringField(1)
      value = _messages.MessageField('extra_types.JsonValue', 2)

    additionalProperties = _messages.MessageField('AdditionalProperty', 1, repeated=True)

  done = _messages.BooleanField(1)
  error = _messages.MessageField('GoogleRpcStatus', 2)
  metadata = _messages.MessageField('MetadataValue', 3)
  name = _messages.StringField(4)
  response = _messages.MessageField('ResponseValue', 5)


class GoogleRpcStatus(_messages.Message):
  r"""The `Status` type defines a logical error model that is suitable for
  different programming environments, including REST APIs and RPC APIs. It is
  used by [gRPC](https://github.com/grpc). Each `Status` message contains
  three pieces of data: error code, error message, and error details. You can
  find out more about this error model and how to work with it in the [API
  Design Guide](https://cloud.google.com/apis/design/errors).

  Messages:
    DetailsValueListEntry: A DetailsValueListEntry object.

  Fields:
    code: The status code, which should be an enum value of google.rpc.Code.
    details: A list of messages that carry the error details. There is a
      common set of message types for APIs to use.
    message: A developer-facing error message, which should be in English. Any
      user-facing error message should be localized and sent in the
      google.rpc.Status.details field, or localized by the client.
  """

  @encoding.MapUnrecognizedFields('additionalProperties')
  class DetailsValueListEntry(_messages.Message):
    r"""A DetailsValueListEntry object.

    Messages:
      AdditionalProperty: An additional property for a DetailsValueListEntry
        object.

    Fields:
      additionalProperties: Properties of the object. Contains field @type
        with type URL.
    """

    class AdditionalProperty(_messages.Message):
      r"""An additional property for a DetailsValueListEntry object.

      Fields:
        key: Name of the additional property.
        value: A extra_types.JsonValue attribute.
      """

      key = _messages.StringField(1)
      value = _messages.MessageField('extra_types.JsonValue', 2)

    additionalProperties = _messages.MessageField('AdditionalProperty', 1, repeated=True)

  code = _messages.IntegerField(1, variant=_messages.Variant.INT32)
  details = _messages.MessageField('DetailsValueListEntry', 2, repeated=True)
  message = _messages.StringField(3)


class SecuredlandingzoneOrganizationsLocationsOperationsGetRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOperationsGetRequest object.

  Fields:
    name: The name of the operation resource.
  """

  name = _messages.StringField(1, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesActivateRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesActivateRequest
  object.

  Fields:
    googleCloudSecuredlandingzoneV1betaActivateOverwatchRequest: A
      GoogleCloudSecuredlandingzoneV1betaActivateOverwatchRequest resource to
      be passed as the request body.
    name: Required. The name of the Overwatch resource to activate. The format
      is organizations/{org_id}/locations/{location_id}/overwatches/{overwatch
      _id}.
  """

  googleCloudSecuredlandingzoneV1betaActivateOverwatchRequest = _messages.MessageField('GoogleCloudSecuredlandingzoneV1betaActivateOverwatchRequest', 1)
  name = _messages.StringField(2, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesCreateRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesCreateRequest
  object.

  Fields:
    googleCloudSecuredlandingzoneV1betaOverwatch: A
      GoogleCloudSecuredlandingzoneV1betaOverwatch resource to be passed as
      the request body.
    overwatchId: Required. Unique id per organization per region for this
      overwatch instance.
    parent: Required. The name of the organization and region in which to
      create the Overwatch resource. The format is
      organizations/{org_id}/locations/{location_id}.
  """

  googleCloudSecuredlandingzoneV1betaOverwatch = _messages.MessageField('GoogleCloudSecuredlandingzoneV1betaOverwatch', 1)
  overwatchId = _messages.StringField(2)
  parent = _messages.StringField(3, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesDeleteRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesDeleteRequest
  object.

  Fields:
    name: Required. The name of the overwatch resource to delete. The format
      is organizations/{org_id}/locations/{location_id}/overwatches/{overwatch
      _id}.
  """

  name = _messages.StringField(1, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesGetRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesGetRequest object.

  Fields:
    name: Required. The name of the overwatch resource to get. The format is
      organizations/{org_id}/locations/{location_id}/overwatches/{overwatch_id
      }.
  """

  name = _messages.StringField(1, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesListRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesListRequest object.

  Fields:
    pageSize: Optional. The maximum number of results to return in a single
      response. Default is 50, minimum is 1 and maximum is 1000.
    pageToken: Optional. The value returned by the last
      `ListOverwatchRequest`; indicates that this is a continuation of the
      prior `ListOverwatchRequest` call and that the system should return the
      next page of data.
    parent: Required. The name of the organization and region to list
      Overwatch resources. The format is
      organizations/{org_id}/locations/{location_id}.
  """

  pageSize = _messages.IntegerField(1, variant=_messages.Variant.INT32)
  pageToken = _messages.StringField(2)
  parent = _messages.StringField(3, required=True)


class SecuredlandingzoneOrganizationsLocationsOverwatchesPatchRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesPatchRequest
  object.

  Fields:
    googleCloudSecuredlandingzoneV1betaOverwatch: A
      GoogleCloudSecuredlandingzoneV1betaOverwatch resource to be passed as
      the request body.
    name: Output only. The name of this Overwatch resource, in the format of
      organizations/{org_id}/locations/{location_id}/overwatches/{overwatch_id
      }.
    updateMask: Optional. The FieldMask to use when updating the Overwatch.
      Only the fields specified here will be updated. This should not be
      empty. Updatable fields are: * blueprint_plan
  """

  googleCloudSecuredlandingzoneV1betaOverwatch = _messages.MessageField('GoogleCloudSecuredlandingzoneV1betaOverwatch', 1)
  name = _messages.StringField(2, required=True)
  updateMask = _messages.StringField(3)


class SecuredlandingzoneOrganizationsLocationsOverwatchesSuspendRequest(_messages.Message):
  r"""A SecuredlandingzoneOrganizationsLocationsOverwatchesSuspendRequest
  object.

  Fields:
    googleCloudSecuredlandingzoneV1betaSuspendOverwatchRequest: A
      GoogleCloudSecuredlandingzoneV1betaSuspendOverwatchRequest resource to
      be passed as the request body.
    name: Required. The name of the Overwatch resource to suspend. The format
      is organizations/{org_id}/locations/{location_id}/overwatches/{overwatch
      _id}.
  """

  googleCloudSecuredlandingzoneV1betaSuspendOverwatchRequest = _messages.MessageField('GoogleCloudSecuredlandingzoneV1betaSuspendOverwatchRequest', 1)
  name = _messages.StringField(2, required=True)


class StandardQueryParameters(_messages.Message):
  r"""Query parameters accepted by all methods.

  Enums:
    FXgafvValueValuesEnum: V1 error format.
    AltValueValuesEnum: Data format for response.

  Fields:
    f__xgafv: V1 error format.
    access_token: OAuth access token.
    alt: Data format for response.
    callback: JSONP
    fields: Selector specifying which fields to include in a partial response.
    key: API key. Your API key identifies your project and provides you with
      API access, quota, and reports. Required unless you provide an OAuth 2.0
      token.
    oauth_token: OAuth 2.0 token for the current user.
    prettyPrint: Returns response with indentations and line breaks.
    quotaUser: Available to use for quota purposes for server-side
      applications. Can be any arbitrary string assigned to a user, but should
      not exceed 40 characters.
    trace: A tracing token of the form "token:<tokenid>" to include in api
      requests.
    uploadType: Legacy upload protocol for media (e.g. "media", "multipart").
    upload_protocol: Upload protocol for media (e.g. "raw", "multipart").
  """

  class AltValueValuesEnum(_messages.Enum):
    r"""Data format for response.

    Values:
      json: Responses with Content-Type of application/json
      media: Media download with context-dependent Content-Type
      proto: Responses with Content-Type of application/x-protobuf
    """
    json = 0
    media = 1
    proto = 2

  class FXgafvValueValuesEnum(_messages.Enum):
    r"""V1 error format.

    Values:
      _1: v1 error format
      _2: v2 error format
    """
    _1 = 0
    _2 = 1

  f__xgafv = _messages.EnumField('FXgafvValueValuesEnum', 1)
  access_token = _messages.StringField(2)
  alt = _messages.EnumField('AltValueValuesEnum', 3, default='json')
  callback = _messages.StringField(4)
  fields = _messages.StringField(5)
  key = _messages.StringField(6)
  oauth_token = _messages.StringField(7)
  prettyPrint = _messages.BooleanField(8, default=True)
  quotaUser = _messages.StringField(9)
  trace = _messages.StringField(10)
  uploadType = _messages.StringField(11)
  upload_protocol = _messages.StringField(12)


encoding.AddCustomJsonFieldMapping(
    StandardQueryParameters, 'f__xgafv', '$.xgafv')
encoding.AddCustomJsonEnumMapping(
    StandardQueryParameters.FXgafvValueValuesEnum, '_1', '1')
encoding.AddCustomJsonEnumMapping(
    StandardQueryParameters.FXgafvValueValuesEnum, '_2', '2')