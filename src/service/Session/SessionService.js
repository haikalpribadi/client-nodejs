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

const grpc = require("grpc");
const services = require("../../../client-nodejs-proto/protocol/session/Session_grpc_pb");
const TxService = require("./TransactionService");


/**
 * This creates a new connection to the server over HTTP2,
 * the connection will contain all the Transaction streams
 */
function SessionService(uri, keyspace, credentials) {
    this.keyspace = keyspace;
    this.credentials = credentials;
    this.stub = new services.SessionServiceClient(uri, grpc.credentials.createInsecure());
}

/**
 * This method creates a new Duplex Stream (this.stub.transaction()) over which gRPC will communicate when
 * exchanging messages related to the Transaction service.
 * It also sends an Open request before returning the TransactionService
 * @param {Grakn.txType} txType type of transaction to be open
 */
SessionService.prototype.transaction = async function create(txType) {
    const txService = new TxService(this.stub.transaction());
    await txService.openTx(this.keyspace, txType, this.credentials);
    return txService;
}

/**
 * Closes connection to the server
 */
SessionService.prototype.close = function close() {
    grpc.closeClient(this.stub);
}

module.exports = SessionService;