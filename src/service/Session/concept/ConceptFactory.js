/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const Methods = require("./Methods");
const ConceptGrpcMessages = require("../../../../client-nodejs-proto/protocol/session/Concept_pb");
const BaseType = require("./BaseTypeConstants").baseType;

/**
 * This factory creates Concepts as Javascipt objects from GrpcConcept provided
 * @param {Object} txService Object implementing all the functionalities of gRPC Transaction as defined in Session.proto
 */
function ConceptFactory(txService) {
  this.txService = txService;
}

ConceptFactory.prototype.createConcept = function createConcept(grpcConcept) {
  const conceptId = grpcConcept.getId();
  let state;
  switch (grpcConcept.getBasetype()) {
    case ConceptGrpcMessages.Concept.BASE_TYPE.ENTITY:
      state = buildState(conceptId, BaseType.ENTITY, this.txService);
      return Object.create(entityProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.RELATION:
      state = buildState(conceptId, BaseType.RELATIONSHIP, this.txService);
      return Object.create(relationshipProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.ATTRIBUTE:
      state = buildState(conceptId, BaseType.ATTRIBUTE, this.txService);
      return Object.create(attributeProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.ENTITY_TYPE:
      state = buildState(conceptId, BaseType.ENTITY_TYPE, this.txService);
      return Object.create(entityTypeProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.RELATION_TYPE:
      state = buildState(conceptId, BaseType.RELATIONSHIP_TYPE, this.txService);
      return Object.create(relationshipTypeProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.ATTRIBUTE_TYPE:
      state = buildState(conceptId, BaseType.ATTRIBUTE_TYPE, this.txService);
      return Object.create(attributeTypeProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.ROLE:
      state = buildState(conceptId, BaseType.ROLE, this.txService);
      return Object.create(roleProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.RULE:
      state = buildState(conceptId, BaseType.RULE, this.txService);
      return Object.create(ruleProto, state);
    case ConceptGrpcMessages.Concept.BASE_TYPE.META_TYPE:
      state = buildState(conceptId, BaseType.META_TYPE, this.txService);
      return Object.create(metaschemaProto, state);
    default:
      throw "BaseType not recognised.";
  }
}

function buildState(conceptId, baseType, txService) {
  return {
    id: { value: conceptId, enumerable: true },
    baseType: { value: baseType, enumerable: true },
    txService: { value: txService, enumerable: true }
  };
}

const attributeTypeProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
  Methods.type,
  Methods.attributeType
);

const relationshipTypeProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
  Methods.type,
  Methods.relationshipType
);

const entityTypeProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
  Methods.type,
  Methods.entityType
);

const relationshipProto = Object.assign({},
  Methods.concept,
  Methods.thing,
  Methods.relationship
);

const attributeProto = Object.assign({},
  Methods.concept,
  Methods.thing,
  Methods.attribute
);

const entityProto = Object.assign({},
  Methods.concept,
  Methods.thing
);

const roleProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
  Methods.role
);

const ruleProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
  Methods.rule
);

const metaschemaProto = Object.assign({},
  Methods.concept,
  Methods.schemaConcept,
);

module.exports = ConceptFactory;
