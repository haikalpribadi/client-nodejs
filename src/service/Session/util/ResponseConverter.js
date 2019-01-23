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

const ProtoDataType = require("../../../../client-nodejs-proto/protocol/session/Concept_pb").AttributeType.DATA_TYPE;

/**
 * This is used to parse gRPC responses and build type of Concepts or Iterators
 */

function ResponseConverter(conceptFactory, iteratorFactory) {
    this.iteratorFactory = iteratorFactory;
    this.conceptFactory = conceptFactory;
}

// SchemaConcept
ResponseConverter.prototype.getLabel = function (resp) {
    return resp.getConceptmethodRes().getResponse().getSchemaconceptGetlabelRes().getLabel();
}
ResponseConverter.prototype.isImplicit = function (resp) {
    return resp.getConceptmethodRes().getResponse().getSchemaconceptIsimplicitRes().getImplicit();
}
ResponseConverter.prototype.subs = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getSchemaconceptSubsIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getSchemaconceptSubsIterRes().getSchemaconcept();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}
ResponseConverter.prototype.sups = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getSchemaconceptSupsIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getSchemaconceptSupsIterRes().getSchemaconcept();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}
ResponseConverter.prototype.getSup = function (resp) {
    const grpcRes = resp.getConceptmethodRes().getResponse().getSchemaconceptGetsupRes();
    if (grpcRes.hasNull()) return null;
    return this.conceptFactory.createConcept(grpcRes.getSchemaconcept());
}

// Type
ResponseConverter.prototype.instances = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getTypeInstancesIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getTypeInstancesIterRes().getThing();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

ResponseConverter.prototype.getAttributeTypes = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getTypeAttributesIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getTypeAttributesIterRes().getAttributetype();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

ResponseConverter.prototype.getKeyTypes = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getTypeKeysIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getTypeKeysIterRes().getAttributetype();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

ResponseConverter.prototype.isAbstract = function (resp) {
    return resp.getConceptmethodRes().getResponse().getTypeIsabstractRes().getAbstract();
}

ResponseConverter.prototype.getRolesPlayedByType = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getTypePlayingIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getTypePlayingIterRes().getRole();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// Entity type
ResponseConverter.prototype.addEntity = function (resp) {
    const grpcConcept = resp.getConceptmethodRes().getResponse().getEntitytypeCreateRes().getEntity();
    return this.conceptFactory.createConcept(grpcConcept);
};

// Attribute type
ResponseConverter.prototype.getAttribute = function (resp) {
    const grpcRes = resp.getConceptmethodRes().getResponse().getAttributetypeAttributeRes();
    return (grpcRes.hasNull()) ? null : this.conceptFactory.createConcept(grpcRes.getAttribute());
}
ResponseConverter.prototype.putAttribute = function (resp) {
    const grpcConcept = resp.getConceptmethodRes().getResponse().getAttributetypeCreateRes().getAttribute();
    return this.conceptFactory.createConcept(grpcConcept);
};

ResponseConverter.prototype.getDataTypeOfType = function (resp) {
    const dataType = resp.getConceptmethodRes().getResponse().getAttributetypeDatatypeRes().getDatatype();
    switch (dataType) {
        case ProtoDataType.STRING: return "String";
        case ProtoDataType.BOOLEAN: return "Boolean";
        case ProtoDataType.INTEGER: return "Integer";
        case ProtoDataType.LONG: return "Long";
        case ProtoDataType.FLOAT: return "Float";
        case ProtoDataType.DOUBLE: return "Double";
        case ProtoDataType.DATE: return "Date";
    }
}

ResponseConverter.prototype.getRegex = function (resp) {
    return resp.getConceptmethodRes().getResponse().getAttributetypeGetregexRes().getRegex();
}

// Relation type
ResponseConverter.prototype.addRelationship = function (resp) {
    const grpcConcept = resp.getConceptmethodRes().getResponse().getRelationtypeCreateRes().getRelation();
    return this.conceptFactory.createConcept(grpcConcept);
};

ResponseConverter.prototype.getRelatedRoles = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getRelationtypeRolesIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getRelationtypeRolesIterRes().getRole();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// Thing
ResponseConverter.prototype.isInferred = function (resp) {
    return resp.getConceptmethodRes().getResponse().getThingIsinferredRes().getInferred();
}

ResponseConverter.prototype.getDirectType = function (resp) {
    const grpcConcept = resp.getConceptmethodRes().getResponse().getThingTypeRes().getType();
    return this.conceptFactory.createConcept(grpcConcept);
}

ResponseConverter.prototype.getRelationshipsByRoles = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getThingRelationsIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getThingRelationsIterRes().getRelation();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}
ResponseConverter.prototype.getRolesPlayedByThing = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getThingRolesIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getThingRolesIterRes().getRole();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}
ResponseConverter.prototype.getAttributesByTypes = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getThingAttributesIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getThingAttributesIterRes().getAttribute();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}
ResponseConverter.prototype.getKeysByTypes = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getThingKeysIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getThingKeysIterRes().getAttribute();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// Attribute
ResponseConverter.prototype.getValue = function (resp) {
    const attrValue = resp.getConceptmethodRes().getResponse().getAttributeValueRes().getValue()
    if (attrValue.hasString()) return attrValue.getString();
    if (attrValue.hasBoolean()) return attrValue.getBoolean();
    if (attrValue.hasInteger()) return attrValue.getInteger();
    if (attrValue.hasLong()) return attrValue.getLong();
    if (attrValue.hasFloat()) return attrValue.getFloat();
    if (attrValue.hasDouble()) return attrValue.getDouble();
    if (attrValue.hasDate()) return new Date(attrValue.getDate());
};

ResponseConverter.prototype.getOwners = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getAttributeOwnersIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getAttributeOwnersIterRes().getThing();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// Relation
ResponseConverter.prototype.rolePlayersMap = async function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getRelationRoleplayersmapIter().getId();
    const iterator = this.iteratorFactory.createRolePlayerIterator(iterId);
    const rolePlayers = await iterator.collect();
    // Temp map to store String id to Role object
    const tempMap = new Map(rolePlayers.map(entry => [entry.role.id, entry.role]));
    const map = new Map();
    // Create map using string as key and set as value
    rolePlayers.forEach(rp => {
        const key = rp.role.id;
        if (map.has(key)) map.set(key, map.get(key).add(rp.player));
        else map.set(key, new Set([rp.player]));
    })
    const resultMap = new Map();
    // Convert map to use Role object as key
    map.forEach((value, key) => {
        resultMap.set(tempMap.get(key), value);
    });
    return resultMap;
}

ResponseConverter.prototype.rolePlayers = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getRelationRoleplayersIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getRelationRoleplayersIterRes().getThing();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// Rule
ResponseConverter.prototype.getWhen = function (resp) {
    const methodRes = resp.getConceptmethodRes().getResponse().getRuleWhenRes();
    return (methodRes.hasNull()) ? null : methodRes.getPattern();
}

ResponseConverter.prototype.getThen = function (resp) {
    const methodRes = resp.getConceptmethodRes().getResponse().getRuleThenRes();
    return (methodRes.hasNull()) ? null : methodRes.getPattern();
}

// Role
ResponseConverter.prototype.getRelationshipTypesThatRelateRole = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getRoleRelationsIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getRoleRelationsIterRes().getRelationtype();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

ResponseConverter.prototype.getTypesThatPlayRole = function (resp) {
    const iterId = resp.getConceptmethodRes().getResponse().getRolePlayersIter().getId();
    const getterMethod = (res) => res.getConceptmethodIterRes().getRolePlayersIterRes().getType();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

// ======================= Grakn transaction methods ========================= //

ResponseConverter.prototype.getSchemaConcept = function (resp) {
    const grpcRes = resp.getGetschemaconceptRes();
    return (grpcRes.hasNull()) ? null : this.conceptFactory.createConcept(grpcRes.getSchemaconcept());
}

ResponseConverter.prototype.getConcept = function (resp) {
    const grpcRes = resp.getGetconceptRes();
    return (grpcRes.hasNull()) ? null : this.conceptFactory.createConcept(grpcRes.getConcept());
}

ResponseConverter.prototype.putEntityType = function (resp) {
    const concept = resp.getPutentitytypeRes().getEntitytype();
    return this.conceptFactory.createConcept(concept);
}

ResponseConverter.prototype.putRelationshipType = function (resp) {
    const concept = resp.getPutrelationtypeRes().getRelationtype();
    return this.conceptFactory.createConcept(concept);
}

ResponseConverter.prototype.putAttributeType = function (resp) {
    const concept = resp.getPutattributetypeRes().getAttributetype();
    return this.conceptFactory.createConcept(concept);
}

ResponseConverter.prototype.putRole = function (resp) {
    const concept = resp.getPutroleRes().getRole();
    return this.conceptFactory.createConcept(concept);
}

ResponseConverter.prototype.putRule = function (resp) {
    const concept = resp.getPutruleRes().getRule();
    return this.conceptFactory.createConcept(concept);
}

ResponseConverter.prototype.getAttributesByValue = function (resp) {
    const iterId = resp.getGetattributesIter().getId();
    const getterMethod = (res) => res.getGetattributesIterRes().getAttribute();
    return this.iteratorFactory.createConceptIterator(iterId, getterMethod);
}

ResponseConverter.prototype.executeQuery = function (resp) {
    const iterRes = resp.getQueryIter();
    return this.iteratorFactory.createQueryIterator(iterRes.getId());
};

module.exports = ResponseConverter;