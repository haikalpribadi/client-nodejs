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

const Session = require('./Session');
const KeyspaceService = require('./service/Keyspace/KeyspaceService');
const messages = require("../client-nodejs-proto/protocol/session/Session_pb");

/**
 * Entry-point for Grakn client, it communicates with a running Grakn server using gRPC.
 * It allows to:
 * - execute operations on keyspaces
 * - obtain a new Session bound to a specific keyspace
 * 
 * @param {String} uri String containing host address and gRPC port of a running Grakn instance, e.g. "localhost:48555"
 * @param {Object} credentials Optional object containing user credentials - only used when connecting to a KGMS instance
 */
function Grakn(uri, credentials) {
    const keyspaceService = new KeyspaceService(uri, credentials);

    this.session = (keyspace) => new Session(uri, keyspace, credentials);

    this.keyspaces = ()=> ({
        delete: (keyspace) => keyspaceService.delete(keyspace),
        retrieve: () => keyspaceService.retrieve()
    });
}

module.exports = Grakn

/**
 * List of available dataTypes for Grakn Attributes
 */
module.exports.dataType = {
    STRING: messages.AttributeType.DATA_TYPE.STRING,
    BOOLEAN: messages.AttributeType.DATA_TYPE.BOOLEAN,
    INTEGER: messages.AttributeType.DATA_TYPE.INTEGER,
    LONG: messages.AttributeType.DATA_TYPE.LONG,
    FLOAT: messages.AttributeType.DATA_TYPE.FLOAT,
    DOUBLE: messages.AttributeType.DATA_TYPE.DOUBLE,
    DATE: messages.AttributeType.DATA_TYPE.DATE
};

/**
 * List of available transaction types supported by Grakn
 */
module.exports.txType = {
    READ: messages.Transaction.Type.READ,
    WRITE: messages.Transaction.Type.WRITE,
    BATCH: messages.Transaction.Type.BATCH
};