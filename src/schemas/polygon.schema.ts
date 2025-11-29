import { Type, Static } from '@sinclair/typebox';

// ============================================
// GeoJSON Polygon Geometry Schema
// ============================================

export const PolygonGeometry = Type.Object({
  type: Type.Literal('Polygon', { description: 'Geometry type must be Polygon' }),
  coordinates: Type.Array(
    Type.Array(
      Type.Array(Type.Number(), { minItems: 2, maxItems: 2 }),
      { minItems: 4 } // Polygon ring must have at least 4 points (closed ring)
    ),
    { minItems: 1, maxItems: 1 } // Polygon has exactly one outer ring
  ),
}, { description: 'GeoJSON Polygon geometry' });

// ============================================
// Polygon Feature Properties
// ============================================

export const PolygonProperties = Type.Object({
  id: Type.Optional(Type.String({ description: 'Polygon ID' })),
  name: Type.Optional(Type.String({ description: 'Polygon name' })),
  area: Type.Optional(Type.Number({ description: 'Polygon area in square meters' })),
}, { additionalProperties: true }); // Allow additional properties

// ============================================
// Request Schemas
// ============================================

export const CreatePolygonBody = Type.Object({
  type: Type.Literal('Feature', { description: 'GeoJSON type must be Feature' }),
  id: Type.Optional(Type.String({ description: 'Optional polygon ID' })),
  geometry: PolygonGeometry,
  properties: Type.Optional(PolygonProperties),
}, {
  description: 'GeoJSON Feature with Polygon geometry',
  additionalProperties: false,
});

// ============================================
// Response Schemas
// ============================================

export const PolygonFeature = Type.Object({
  id: Type.String({ description: 'Polygon ID' }),
  type: Type.Literal('Feature'),
  properties: Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
    area: Type.Optional(Type.Number()),
  }),
  geometry: PolygonGeometry,
}, { additionalProperties: true });

export const PolygonFeatureCollection = Type.Object({
  type: Type.Literal('FeatureCollection'),
  features: Type.Array(PolygonFeature),
});

export const CreatePolygonResponse = Type.Object({
  status: Type.Boolean({ description: 'Operation status' }),
  message: Type.String({ description: 'Response message' }),
  data: PolygonFeature,
});

export const GetPolygonsResponse = Type.Object({
  status: Type.Boolean({ description: 'Operation status' }),
  message: Type.String({ description: 'Response message' }),
  data: PolygonFeatureCollection,
});

export const DeletePolygonResponse = Type.Object({
  status: Type.Boolean({ description: 'Operation status' }),
  message: Type.String({ description: 'Response message' }),
  data: Type.Number({ description: 'Number of deleted polygons' }),
});

// ============================================
// Error Response Schema
// ============================================

export const ErrorResponse = Type.Object({
  error: Type.String({ description: 'Error name' }),
  message: Type.Optional(Type.String({ description: 'Error message' })),
  statusCode: Type.Number({ description: 'HTTP status code' }),
});

// ============================================
// Type Exports
// ============================================

export type CreatePolygonBodyType = Static<typeof CreatePolygonBody>;
export type PolygonFeatureType = Static<typeof PolygonFeature>;
export type PolygonFeatureCollectionType = Static<typeof PolygonFeatureCollection>;
export type CreatePolygonResponseType = Static<typeof CreatePolygonResponse>;
export type GetPolygonsResponseType = Static<typeof GetPolygonsResponse>;
export type DeletePolygonResponseType = Static<typeof DeletePolygonResponse>;
export type ErrorResponseType = Static<typeof ErrorResponse>;

