IF OBJECT_ID('authority.ContractDocument', 'U') IS NULL
BEGIN
    CREATE TABLE authority.ContractDocument
    (
        ContractSnapshotId varchar(80) NOT NULL,
        CanonicalJson nvarchar(max) NOT NULL,
        CanonicalByteLength int NOT NULL,
        AuthorityDigest varchar(80) NOT NULL,
        CONSTRAINT PK_ContractDocument PRIMARY KEY (ContractSnapshotId),
        CONSTRAINT FK_ContractDocument_ContractSnapshot FOREIGN KEY (ContractSnapshotId)
            REFERENCES authority.ContractSnapshot(ContractSnapshotId),
        CONSTRAINT CK_ContractDocument_Json CHECK (ISJSON(CanonicalJson) = 1),
        CONSTRAINT CK_ContractDocument_ByteLength CHECK (CanonicalByteLength > 0)
    );
END;
GO

IF OBJECT_ID('authority.ContractNode', 'U') IS NULL
BEGIN
    CREATE TABLE authority.ContractNode
    (
        ContractSnapshotId varchar(80) NOT NULL,
        NodeOrdinal int NOT NULL,
        JsonPointer nvarchar(2048) NOT NULL,
        PointerDigest varchar(80) NOT NULL,
        ParentJsonPointer nvarchar(2048) NULL,
        ParentPointerDigest varchar(80) NULL,
        PathSegment nvarchar(2048) NULL,
        ArrayIndex int NULL,
        SiblingOrdinal int NOT NULL,
        ValueType varchar(20) NOT NULL,
        ScalarValue nvarchar(max) NULL,
        NodeDigest varchar(80) NOT NULL,
        CONSTRAINT PK_ContractNode PRIMARY KEY (ContractSnapshotId, NodeOrdinal),
        CONSTRAINT UQ_ContractNode_Pointer UNIQUE (ContractSnapshotId, PointerDigest),
        CONSTRAINT FK_ContractNode_ContractDocument FOREIGN KEY (ContractSnapshotId)
            REFERENCES authority.ContractDocument(ContractSnapshotId),
        CONSTRAINT FK_ContractNode_Parent FOREIGN KEY (ContractSnapshotId, ParentPointerDigest)
            REFERENCES authority.ContractNode(ContractSnapshotId, PointerDigest),
        CONSTRAINT CK_ContractNode_Ordinal CHECK (NodeOrdinal >= 0 AND SiblingOrdinal >= 0),
        CONSTRAINT CK_ContractNode_ArrayIndex CHECK (ArrayIndex IS NULL OR ArrayIndex >= 0),
        CONSTRAINT CK_ContractNode_ValueType CHECK (ValueType IN ('null', 'boolean', 'number', 'string', 'array', 'object')),
        CONSTRAINT CK_ContractNode_Scalar CHECK
        (
            (ValueType IN ('array', 'object', 'null') AND ScalarValue IS NULL)
            OR (ValueType IN ('boolean', 'number', 'string') AND ScalarValue IS NOT NULL)
        ),
        CONSTRAINT CK_ContractNode_RootOrChild CHECK
        (
            (NodeOrdinal = 0 AND JsonPointer = N'' AND ParentJsonPointer IS NULL AND ParentPointerDigest IS NULL AND PathSegment IS NULL AND ArrayIndex IS NULL)
            OR (NodeOrdinal > 0 AND JsonPointer <> N'' AND ParentJsonPointer IS NOT NULL AND ParentPointerDigest IS NOT NULL AND ((PathSegment IS NOT NULL AND ArrayIndex IS NULL) OR (PathSegment IS NULL AND ArrayIndex IS NOT NULL)))
        )
    );
END;
GO
