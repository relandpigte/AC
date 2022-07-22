CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(95) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
);

CREATE TABLE `AbpAuditLogs` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `TenantId` int NULL,
    `UserId` bigint NULL,
    `ServiceName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `MethodName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `Parameters` varchar(1024) CHARACTER SET utf8mb4 NULL,
    `ReturnValue` longtext CHARACTER SET utf8mb4 NULL,
    `ExecutionTime` datetime(6) NOT NULL,
    `ExecutionDuration` int NOT NULL,
    `ClientIpAddress` varchar(64) CHARACTER SET utf8mb4 NULL,
    `ClientName` varchar(128) CHARACTER SET utf8mb4 NULL,
    `BrowserInfo` varchar(512) CHARACTER SET utf8mb4 NULL,
    `Exception` varchar(2000) CHARACTER SET utf8mb4 NULL,
    `ImpersonatorUserId` bigint NULL,
    `ImpersonatorTenantId` int NULL,
    `CustomData` varchar(2000) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpAuditLogs` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpBackgroundJobs` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `JobType` varchar(512) CHARACTER SET utf8mb4 NOT NULL,
    `JobArgs` longtext CHARACTER SET utf8mb4 NOT NULL,
    `TryCount` smallint NOT NULL,
    `NextTryTime` datetime(6) NOT NULL,
    `LastTryTime` datetime(6) NULL,
    `IsAbandoned` tinyint(1) NOT NULL,
    `Priority` tinyint unsigned NOT NULL,
    CONSTRAINT `PK_AbpBackgroundJobs` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpDynamicProperties` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PropertyName` varchar(255) CHARACTER SET utf8mb4 NULL,
    `InputType` longtext CHARACTER SET utf8mb4 NULL,
    `Permission` longtext CHARACTER SET utf8mb4 NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpDynamicProperties` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpEditions` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `Name` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    `DisplayName` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AbpEditions` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpEntityChangeSets` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `BrowserInfo` varchar(512) CHARACTER SET utf8mb4 NULL,
    `ClientIpAddress` varchar(64) CHARACTER SET utf8mb4 NULL,
    `ClientName` varchar(128) CHARACTER SET utf8mb4 NULL,
    `CreationTime` datetime(6) NOT NULL,
    `ExtensionData` longtext CHARACTER SET utf8mb4 NULL,
    `ImpersonatorTenantId` int NULL,
    `ImpersonatorUserId` bigint NULL,
    `Reason` varchar(256) CHARACTER SET utf8mb4 NULL,
    `TenantId` int NULL,
    `UserId` bigint NULL,
    CONSTRAINT `PK_AbpEntityChangeSets` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpLanguages` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `TenantId` int NULL,
    `Name` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `DisplayName` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `Icon` varchar(128) CHARACTER SET utf8mb4 NULL,
    `IsDisabled` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AbpLanguages` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpLanguageTexts` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `TenantId` int NULL,
    `LanguageName` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `Source` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `Key` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `Value` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AbpLanguageTexts` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpNotifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `NotificationName` varchar(96) CHARACTER SET utf8mb4 NOT NULL,
    `Data` longtext CHARACTER SET utf8mb4 NULL,
    `DataTypeName` varchar(512) CHARACTER SET utf8mb4 NULL,
    `EntityTypeName` varchar(250) CHARACTER SET utf8mb4 NULL,
    `EntityTypeAssemblyQualifiedName` varchar(512) CHARACTER SET utf8mb4 NULL,
    `EntityId` varchar(96) CHARACTER SET utf8mb4 NULL,
    `Severity` tinyint unsigned NOT NULL,
    `UserIds` longtext CHARACTER SET utf8mb4 NULL,
    `ExcludedUserIds` longtext CHARACTER SET utf8mb4 NULL,
    `TenantIds` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpNotifications` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpNotificationSubscriptions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `NotificationName` varchar(96) CHARACTER SET utf8mb4 NULL,
    `EntityTypeName` varchar(250) CHARACTER SET utf8mb4 NULL,
    `EntityTypeAssemblyQualifiedName` varchar(512) CHARACTER SET utf8mb4 NULL,
    `EntityId` varchar(96) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpNotificationSubscriptions` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpOrganizationUnitRoles` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `RoleId` int NOT NULL,
    `OrganizationUnitId` bigint NOT NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AbpOrganizationUnitRoles` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpOrganizationUnits` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `TenantId` int NULL,
    `ParentId` bigint NULL,
    `Code` varchar(95) CHARACTER SET utf8mb4 NOT NULL,
    `DisplayName` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AbpOrganizationUnits` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpOrganizationUnits_AbpOrganizationUnits_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AbpOrganizationUnits` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AbpTenantNotifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `NotificationName` varchar(96) CHARACTER SET utf8mb4 NOT NULL,
    `Data` longtext CHARACTER SET utf8mb4 NULL,
    `DataTypeName` varchar(512) CHARACTER SET utf8mb4 NULL,
    `EntityTypeName` varchar(250) CHARACTER SET utf8mb4 NULL,
    `EntityTypeAssemblyQualifiedName` varchar(512) CHARACTER SET utf8mb4 NULL,
    `EntityId` varchar(96) CHARACTER SET utf8mb4 NULL,
    `Severity` tinyint unsigned NOT NULL,
    CONSTRAINT `PK_AbpTenantNotifications` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpUserAccounts` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `UserLinkId` bigint NULL,
    `UserName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `EmailAddress` varchar(256) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpUserAccounts` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpUserLoginAttempts` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `TenantId` int NULL,
    `TenancyName` varchar(64) CHARACTER SET utf8mb4 NULL,
    `UserId` bigint NULL,
    `UserNameOrEmailAddress` varchar(256) CHARACTER SET utf8mb4 NULL,
    `ClientIpAddress` varchar(64) CHARACTER SET utf8mb4 NULL,
    `ClientName` varchar(128) CHARACTER SET utf8mb4 NULL,
    `BrowserInfo` varchar(512) CHARACTER SET utf8mb4 NULL,
    `Result` tinyint unsigned NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    CONSTRAINT `PK_AbpUserLoginAttempts` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpUserNotifications` (
    `Id` char(36) NOT NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `TenantNotificationId` char(36) NOT NULL,
    `State` int NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    CONSTRAINT `PK_AbpUserNotifications` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpUserOrganizationUnits` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `OrganizationUnitId` bigint NOT NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AbpUserOrganizationUnits` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpUsers` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `AuthenticationSource` varchar(64) CHARACTER SET utf8mb4 NULL,
    `UserName` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `TenantId` int NULL,
    `EmailAddress` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `Name` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `Surname` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `Password` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `EmailConfirmationCode` varchar(328) CHARACTER SET utf8mb4 NULL,
    `PasswordResetCode` varchar(328) CHARACTER SET utf8mb4 NULL,
    `LockoutEndDateUtc` datetime(6) NULL,
    `AccessFailedCount` int NOT NULL,
    `IsLockoutEnabled` tinyint(1) NOT NULL,
    `PhoneNumber` varchar(32) CHARACTER SET utf8mb4 NULL,
    `IsPhoneNumberConfirmed` tinyint(1) NOT NULL,
    `SecurityStamp` varchar(128) CHARACTER SET utf8mb4 NULL,
    `IsTwoFactorEnabled` tinyint(1) NOT NULL,
    `IsEmailConfirmed` tinyint(1) NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `NormalizedEmailAddress` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `ConcurrencyStamp` varchar(128) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpUsers` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpUsers_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpUsers_AbpUsers_DeleterUserId` FOREIGN KEY (`DeleterUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpUsers_AbpUsers_LastModifierUserId` FOREIGN KEY (`LastModifierUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AbpWebhookEvents` (
    `Id` char(36) NOT NULL,
    `WebhookName` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Data` longtext CHARACTER SET utf8mb4 NULL,
    `CreationTime` datetime(6) NOT NULL,
    `TenantId` int NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletionTime` datetime(6) NULL,
    CONSTRAINT `PK_AbpWebhookEvents` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpWebhookSubscriptions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `WebhookUri` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Secret` longtext CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `Webhooks` longtext CHARACTER SET utf8mb4 NULL,
    `Headers` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpWebhookSubscriptions` PRIMARY KEY (`Id`)
);

CREATE TABLE `AbpDynamicEntityProperties` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `EntityFullName` varchar(255) CHARACTER SET utf8mb4 NULL,
    `DynamicPropertyId` int NOT NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpDynamicEntityProperties` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpDynamicEntityProperties_AbpDynamicProperties_DynamicPrope~` FOREIGN KEY (`DynamicPropertyId`) REFERENCES `AbpDynamicProperties` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpDynamicPropertyValues` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Value` longtext CHARACTER SET utf8mb4 NOT NULL,
    `TenantId` int NULL,
    `DynamicPropertyId` int NOT NULL,
    CONSTRAINT `PK_AbpDynamicPropertyValues` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpDynamicPropertyValues_AbpDynamicProperties_DynamicPropert~` FOREIGN KEY (`DynamicPropertyId`) REFERENCES `AbpDynamicProperties` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpFeatures` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `Name` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `Value` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
    `Discriminator` longtext CHARACTER SET utf8mb4 NOT NULL,
    `EditionId` int NULL,
    CONSTRAINT `PK_AbpFeatures` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpFeatures_AbpEditions_EditionId` FOREIGN KEY (`EditionId`) REFERENCES `AbpEditions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpEntityChanges` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `ChangeTime` datetime(6) NOT NULL,
    `ChangeType` tinyint unsigned NOT NULL,
    `EntityChangeSetId` bigint NOT NULL,
    `EntityId` varchar(48) CHARACTER SET utf8mb4 NULL,
    `EntityTypeFullName` varchar(192) CHARACTER SET utf8mb4 NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpEntityChanges` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpEntityChanges_AbpEntityChangeSets_EntityChangeSetId` FOREIGN KEY (`EntityChangeSetId`) REFERENCES `AbpEntityChangeSets` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpRoles` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `TenantId` int NULL,
    `Name` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    `DisplayName` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `IsStatic` tinyint(1) NOT NULL,
    `IsDefault` tinyint(1) NOT NULL,
    `NormalizedName` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    `ConcurrencyStamp` varchar(128) CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpRoles` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpRoles_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpRoles_AbpUsers_DeleterUserId` FOREIGN KEY (`DeleterUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpRoles_AbpUsers_LastModifierUserId` FOREIGN KEY (`LastModifierUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AbpSettings` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `TenantId` int NULL,
    `UserId` bigint NULL,
    `Name` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    `Value` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpSettings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpSettings_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AbpTenants` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `TenancyName` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `Name` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `ConnectionString` varchar(1024) CHARACTER SET utf8mb4 NULL,
    `IsActive` tinyint(1) NOT NULL,
    `EditionId` int NULL,
    CONSTRAINT `PK_AbpTenants` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpTenants_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpTenants_AbpUsers_DeleterUserId` FOREIGN KEY (`DeleterUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpTenants_AbpEditions_EditionId` FOREIGN KEY (`EditionId`) REFERENCES `AbpEditions` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AbpTenants_AbpUsers_LastModifierUserId` FOREIGN KEY (`LastModifierUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AbpUserClaims` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `ClaimType` varchar(256) CHARACTER SET utf8mb4 NULL,
    `ClaimValue` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpUserClaims` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpUserClaims_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpUserLogins` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `LoginProvider` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `ProviderKey` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AbpUserLogins` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpUserLogins_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpUserRoles` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `RoleId` int NOT NULL,
    CONSTRAINT `PK_AbpUserRoles` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpUserRoles_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpUserTokens` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `TenantId` int NULL,
    `UserId` bigint NOT NULL,
    `LoginProvider` varchar(128) CHARACTER SET utf8mb4 NULL,
    `Name` varchar(128) CHARACTER SET utf8mb4 NULL,
    `Value` varchar(512) CHARACTER SET utf8mb4 NULL,
    `ExpireDate` datetime(6) NULL,
    CONSTRAINT `PK_AbpUserTokens` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpUserTokens_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpWebhookSendAttempts` (
    `Id` char(36) NOT NULL,
    `WebhookEventId` char(36) NOT NULL,
    `WebhookSubscriptionId` char(36) NOT NULL,
    `Response` longtext CHARACTER SET utf8mb4 NULL,
    `ResponseStatusCode` int NULL,
    `CreationTime` datetime(6) NOT NULL,
    `LastModificationTime` datetime(6) NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpWebhookSendAttempts` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpWebhookSendAttempts_AbpWebhookEvents_WebhookEventId` FOREIGN KEY (`WebhookEventId`) REFERENCES `AbpWebhookEvents` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpDynamicEntityPropertyValues` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Value` longtext CHARACTER SET utf8mb4 NOT NULL,
    `EntityId` longtext CHARACTER SET utf8mb4 NULL,
    `DynamicEntityPropertyId` int NOT NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpDynamicEntityPropertyValues` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpDynamicEntityPropertyValues_AbpDynamicEntityProperties_Dy~` FOREIGN KEY (`DynamicEntityPropertyId`) REFERENCES `AbpDynamicEntityProperties` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpEntityPropertyChanges` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `EntityChangeId` bigint NOT NULL,
    `NewValue` varchar(512) CHARACTER SET utf8mb4 NULL,
    `OriginalValue` varchar(512) CHARACTER SET utf8mb4 NULL,
    `PropertyName` varchar(96) CHARACTER SET utf8mb4 NULL,
    `PropertyTypeFullName` varchar(192) CHARACTER SET utf8mb4 NULL,
    `TenantId` int NULL,
    CONSTRAINT `PK_AbpEntityPropertyChanges` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId` FOREIGN KEY (`EntityChangeId`) REFERENCES `AbpEntityChanges` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpPermissions` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `Name` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
    `IsGranted` tinyint(1) NOT NULL,
    `Discriminator` longtext CHARACTER SET utf8mb4 NOT NULL,
    `RoleId` int NULL,
    `UserId` bigint NULL,
    CONSTRAINT `PK_AbpPermissions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpPermissions_AbpRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AbpRoles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AbpPermissions_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AbpRoleClaims` (
    `Id` bigint NOT NULL AUTO_INCREMENT,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TenantId` int NULL,
    `RoleId` int NOT NULL,
    `ClaimType` varchar(256) CHARACTER SET utf8mb4 NULL,
    `ClaimValue` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AbpRoleClaims` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AbpRoleClaims_AbpRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AbpRoles` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_AbpAuditLogs_TenantId_ExecutionDuration` ON `AbpAuditLogs` (`TenantId`, `ExecutionDuration`);

CREATE INDEX `IX_AbpAuditLogs_TenantId_ExecutionTime` ON `AbpAuditLogs` (`TenantId`, `ExecutionTime`);

CREATE INDEX `IX_AbpAuditLogs_TenantId_UserId` ON `AbpAuditLogs` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpBackgroundJobs_IsAbandoned_NextTryTime` ON `AbpBackgroundJobs` (`IsAbandoned`, `NextTryTime`);

CREATE INDEX `IX_AbpDynamicEntityProperties_DynamicPropertyId` ON `AbpDynamicEntityProperties` (`DynamicPropertyId`);

CREATE UNIQUE INDEX `IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId_~` ON `AbpDynamicEntityProperties` (`EntityFullName`, `DynamicPropertyId`, `TenantId`);

CREATE INDEX `IX_AbpDynamicEntityPropertyValues_DynamicEntityPropertyId` ON `AbpDynamicEntityPropertyValues` (`DynamicEntityPropertyId`);

CREATE UNIQUE INDEX `IX_AbpDynamicProperties_PropertyName_TenantId` ON `AbpDynamicProperties` (`PropertyName`, `TenantId`);

CREATE INDEX `IX_AbpDynamicPropertyValues_DynamicPropertyId` ON `AbpDynamicPropertyValues` (`DynamicPropertyId`);

CREATE INDEX `IX_AbpEntityChanges_EntityChangeSetId` ON `AbpEntityChanges` (`EntityChangeSetId`);

CREATE INDEX `IX_AbpEntityChanges_EntityTypeFullName_EntityId` ON `AbpEntityChanges` (`EntityTypeFullName`, `EntityId`);

CREATE INDEX `IX_AbpEntityChangeSets_TenantId_CreationTime` ON `AbpEntityChangeSets` (`TenantId`, `CreationTime`);

CREATE INDEX `IX_AbpEntityChangeSets_TenantId_Reason` ON `AbpEntityChangeSets` (`TenantId`, `Reason`);

CREATE INDEX `IX_AbpEntityChangeSets_TenantId_UserId` ON `AbpEntityChangeSets` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpEntityPropertyChanges_EntityChangeId` ON `AbpEntityPropertyChanges` (`EntityChangeId`);

CREATE INDEX `IX_AbpFeatures_EditionId_Name` ON `AbpFeatures` (`EditionId`, `Name`);

CREATE INDEX `IX_AbpFeatures_TenantId_Name` ON `AbpFeatures` (`TenantId`, `Name`);

CREATE INDEX `IX_AbpLanguages_TenantId_Name` ON `AbpLanguages` (`TenantId`, `Name`);

CREATE INDEX `IX_AbpLanguageTexts_TenantId_Source_LanguageName_Key` ON `AbpLanguageTexts` (`TenantId`, `Source`, `LanguageName`, `Key`);

CREATE INDEX `IX_AbpNotificationSubscriptions_NotificationName_EntityTypeName~` ON `AbpNotificationSubscriptions` (`NotificationName`, `EntityTypeName`, `EntityId`, `UserId`);

CREATE INDEX `IX_AbpNotificationSubscriptions_TenantId_NotificationName_Entit~` ON `AbpNotificationSubscriptions` (`TenantId`, `NotificationName`, `EntityTypeName`, `EntityId`, `UserId`);

CREATE INDEX `IX_AbpOrganizationUnitRoles_TenantId_OrganizationUnitId` ON `AbpOrganizationUnitRoles` (`TenantId`, `OrganizationUnitId`);

CREATE INDEX `IX_AbpOrganizationUnitRoles_TenantId_RoleId` ON `AbpOrganizationUnitRoles` (`TenantId`, `RoleId`);

CREATE INDEX `IX_AbpOrganizationUnits_ParentId` ON `AbpOrganizationUnits` (`ParentId`);

CREATE INDEX `IX_AbpOrganizationUnits_TenantId_Code` ON `AbpOrganizationUnits` (`TenantId`, `Code`);

CREATE INDEX `IX_AbpPermissions_TenantId_Name` ON `AbpPermissions` (`TenantId`, `Name`);

CREATE INDEX `IX_AbpPermissions_RoleId` ON `AbpPermissions` (`RoleId`);

CREATE INDEX `IX_AbpPermissions_UserId` ON `AbpPermissions` (`UserId`);

CREATE INDEX `IX_AbpRoleClaims_RoleId` ON `AbpRoleClaims` (`RoleId`);

CREATE INDEX `IX_AbpRoleClaims_TenantId_ClaimType` ON `AbpRoleClaims` (`TenantId`, `ClaimType`);

CREATE INDEX `IX_AbpRoles_CreatorUserId` ON `AbpRoles` (`CreatorUserId`);

CREATE INDEX `IX_AbpRoles_DeleterUserId` ON `AbpRoles` (`DeleterUserId`);

CREATE INDEX `IX_AbpRoles_LastModifierUserId` ON `AbpRoles` (`LastModifierUserId`);

CREATE INDEX `IX_AbpRoles_TenantId_NormalizedName` ON `AbpRoles` (`TenantId`, `NormalizedName`);

CREATE INDEX `IX_AbpSettings_UserId` ON `AbpSettings` (`UserId`);

CREATE UNIQUE INDEX `IX_AbpSettings_TenantId_Name_UserId` ON `AbpSettings` (`TenantId`, `Name`, `UserId`);

CREATE INDEX `IX_AbpTenantNotifications_TenantId` ON `AbpTenantNotifications` (`TenantId`);

CREATE INDEX `IX_AbpTenants_CreatorUserId` ON `AbpTenants` (`CreatorUserId`);

CREATE INDEX `IX_AbpTenants_DeleterUserId` ON `AbpTenants` (`DeleterUserId`);

CREATE INDEX `IX_AbpTenants_EditionId` ON `AbpTenants` (`EditionId`);

CREATE INDEX `IX_AbpTenants_LastModifierUserId` ON `AbpTenants` (`LastModifierUserId`);

CREATE INDEX `IX_AbpTenants_TenancyName` ON `AbpTenants` (`TenancyName`);

CREATE INDEX `IX_AbpUserAccounts_EmailAddress` ON `AbpUserAccounts` (`EmailAddress`);

CREATE INDEX `IX_AbpUserAccounts_UserName` ON `AbpUserAccounts` (`UserName`);

CREATE INDEX `IX_AbpUserAccounts_TenantId_EmailAddress` ON `AbpUserAccounts` (`TenantId`, `EmailAddress`);

CREATE INDEX `IX_AbpUserAccounts_TenantId_UserId` ON `AbpUserAccounts` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpUserAccounts_TenantId_UserName` ON `AbpUserAccounts` (`TenantId`, `UserName`);

CREATE INDEX `IX_AbpUserClaims_UserId` ON `AbpUserClaims` (`UserId`);

CREATE INDEX `IX_AbpUserClaims_TenantId_ClaimType` ON `AbpUserClaims` (`TenantId`, `ClaimType`);

CREATE INDEX `IX_AbpUserLoginAttempts_UserId_TenantId` ON `AbpUserLoginAttempts` (`UserId`, `TenantId`);

CREATE INDEX `IX_AbpUserLoginAttempts_TenancyName_UserNameOrEmailAddress_Resu~` ON `AbpUserLoginAttempts` (`TenancyName`, `UserNameOrEmailAddress`, `Result`);

CREATE INDEX `IX_AbpUserLogins_UserId` ON `AbpUserLogins` (`UserId`);

CREATE INDEX `IX_AbpUserLogins_TenantId_UserId` ON `AbpUserLogins` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpUserLogins_TenantId_LoginProvider_ProviderKey` ON `AbpUserLogins` (`TenantId`, `LoginProvider`, `ProviderKey`);

CREATE INDEX `IX_AbpUserNotifications_UserId_State_CreationTime` ON `AbpUserNotifications` (`UserId`, `State`, `CreationTime`);

CREATE INDEX `IX_AbpUserOrganizationUnits_TenantId_OrganizationUnitId` ON `AbpUserOrganizationUnits` (`TenantId`, `OrganizationUnitId`);

CREATE INDEX `IX_AbpUserOrganizationUnits_TenantId_UserId` ON `AbpUserOrganizationUnits` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpUserRoles_UserId` ON `AbpUserRoles` (`UserId`);

CREATE INDEX `IX_AbpUserRoles_TenantId_RoleId` ON `AbpUserRoles` (`TenantId`, `RoleId`);

CREATE INDEX `IX_AbpUserRoles_TenantId_UserId` ON `AbpUserRoles` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpUsers_CreatorUserId` ON `AbpUsers` (`CreatorUserId`);

CREATE INDEX `IX_AbpUsers_DeleterUserId` ON `AbpUsers` (`DeleterUserId`);

CREATE INDEX `IX_AbpUsers_LastModifierUserId` ON `AbpUsers` (`LastModifierUserId`);

CREATE INDEX `IX_AbpUsers_TenantId_NormalizedEmailAddress` ON `AbpUsers` (`TenantId`, `NormalizedEmailAddress`);

CREATE INDEX `IX_AbpUsers_TenantId_NormalizedUserName` ON `AbpUsers` (`TenantId`, `NormalizedUserName`);

CREATE INDEX `IX_AbpUserTokens_UserId` ON `AbpUserTokens` (`UserId`);

CREATE INDEX `IX_AbpUserTokens_TenantId_UserId` ON `AbpUserTokens` (`TenantId`, `UserId`);

CREATE INDEX `IX_AbpWebhookSendAttempts_WebhookEventId` ON `AbpWebhookSendAttempts` (`WebhookEventId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20210218052420_Initial_Migration', '3.1.8');

ALTER TABLE `AbpUsers` ADD `About` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `AddressLine1` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `AddressLine2` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `City` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `Country` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `CoverPhotoDocumentId` char(36) NULL;

ALTER TABLE `AbpUsers` ADD `DateOfBirth` datetime(6) NULL;

ALTER TABLE `AbpUsers` ADD `DeleteDate` datetime(6) NULL;

ALTER TABLE `AbpUsers` ADD `IntroVideoDocumentId` char(36) NULL;

ALTER TABLE `AbpUsers` ADD `IsPublic` tinyint(1) NOT NULL DEFAULT FALSE;

ALTER TABLE `AbpUsers` ADD `Latitude` double NULL;

ALTER TABLE `AbpUsers` ADD `Longitude` double NULL;

ALTER TABLE `AbpUsers` ADD `ProfilePictureDocumentId` char(36) NULL;

ALTER TABLE `AbpUsers` ADD `StateOrProvince` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `StripeUserId` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `WebsiteUrl` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `AbpUsers` ADD `ZipOrPostCode` longtext CHARACTER SET utf8mb4 NULL;

CREATE TABLE `abpauditlogs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ExecutionTime` datetime(6) NOT NULL,
    `ImpersonatorUserId` bigint NULL,
    `Exception` longtext CHARACTER SET utf8mb4 NULL,
    `BrowserInfo` longtext CHARACTER SET utf8mb4 NULL,
    `ClientName` longtext CHARACTER SET utf8mb4 NULL,
    `ClientIpAddress` longtext CHARACTER SET utf8mb4 NULL,
    `ExecutionDuration` int NOT NULL,
    `ReturnValue` longtext CHARACTER SET utf8mb4 NULL,
    `TenantId` int NULL,
    `MethodName` longtext CHARACTER SET utf8mb4 NULL,
    `ServiceName` longtext CHARACTER SET utf8mb4 NULL,
    `UserId` bigint NULL,
    `ImpersonatorTenantId` int NULL,
    `Parameters` longtext CHARACTER SET utf8mb4 NULL,
    `CustomData` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_abpauditlogs` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyAcademicLevels` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `DisplayOrder` int NOT NULL,
    CONSTRAINT `PK_AcademicallyAcademicLevels` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyAcceptanceLogs` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `IpAddress` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyAcceptanceLogs` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyComments` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Body` longtext CHARACTER SET utf8mb4 NULL,
    `ParentId` char(36) NULL,
    `ReferenceId` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyComments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyComments_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyComments_AcademicallyComments_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyComments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyConferenceSessions` (
    `Id` char(36) NOT NULL,
    `Offer` longtext CHARACTER SET utf8mb4 NULL,
    `Answer` longtext CHARACTER SET utf8mb4 NULL,
    `ReferenceId` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    CONSTRAINT `PK_AcademicallyConferenceSessions` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyContentMargins` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Top` int NOT NULL,
    `Bottom` int NOT NULL,
    `Width` int NOT NULL,
    CONSTRAINT `PK_AcademicallyContentMargins` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyContents` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `PageContent` longtext CHARACTER SET utf8mb4 NULL,
    `ReferenceId` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyContents` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyCurrencies` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Code` longtext CHARACTER SET utf8mb4 NULL,
    `IsEnabled` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyCurrencies` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyDisciplineTaxonomies` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ParentId` char(36) NULL,
    `ParentIdMap` longtext CHARACTER SET utf8mb4 NULL,
    `IsEditable` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyDisciplineTaxonomies` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyDisciplineTaxonomies_AcademicallyDisciplineTaxon~` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyDisciplineTaxonomies` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyDocuments` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `OriginalFileName` longtext CHARACTER SET utf8mb4 NULL,
    `FileType` longtext CHARACTER SET utf8mb4 NULL,
    `DocumentType` int NOT NULL,
    `Size` bigint NOT NULL,
    CONSTRAINT `PK_AcademicallyDocuments` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyEducationLevels` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ShortName` longtext CHARACTER SET utf8mb4 NULL,
    `DisplayOrder` int NOT NULL,
    CONSTRAINT `PK_AcademicallyEducationLevels` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyForums` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Message` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyForums` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyForums_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyPasswordResets` (
    `Id` char(36) NOT NULL,
    `DateSent` datetime(6) NOT NULL,
    `IsResetted` tinyint(1) NOT NULL,
    `ResetDate` datetime(6) NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyPasswordResets` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyPhoneVerifications` (
    `Id` char(36) NOT NULL,
    `UserId` bigint NOT NULL,
    `Recipient` longtext CHARACTER SET utf8mb4 NULL,
    `Code` longtext CHARACTER SET utf8mb4 NULL,
    `DateSent` datetime(6) NOT NULL,
    `DateConfirmed` datetime(6) NULL,
    CONSTRAINT `PK_AcademicallyPhoneVerifications` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyProjects` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `LastModificationTime` datetime(6) NULL,
    `LastModifierUserId` bigint NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeleterUserId` bigint NULL,
    `DeletionTime` datetime(6) NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `AcademicLevel` longtext CHARACTER SET utf8mb4 NULL,
    `Qualification` longtext CHARACTER SET utf8mb4 NULL,
    `Methodology` longtext CHARACTER SET utf8mb4 NULL,
    `SubjectArea` longtext CHARACTER SET utf8mb4 NULL,
    `SubjectKeyWords` longtext CHARACTER SET utf8mb4 NULL,
    `UrgencyLevel` longtext CHARACTER SET utf8mb4 NULL,
    `Deadline` datetime(6) NULL,
    `IsPrivateRequest` tinyint(1) NULL,
    `HasFiles` tinyint(1) NULL,
    `ServiceLevel1` char(36) NULL,
    `ServiceNameLevel1` longtext CHARACTER SET utf8mb4 NULL,
    `ServiceLevel2` char(36) NULL,
    `ServiceNameLevel2` longtext CHARACTER SET utf8mb4 NULL,
    `ServiceLevel3` char(36) NULL,
    `ServiceNameLevel3` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyProjects` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyProjects_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyPublicationTags` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyPublicationTags` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyQuestions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Body` longtext CHARACTER SET utf8mb4 NULL,
    `ParentId` char(36) NULL,
    `ReferenceId` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyQuestions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyQuestions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyQuestions_AcademicallyQuestions_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyQuestions` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyReactions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `ReferenceId` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyReactions` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyRegistrations` (
    `Id` char(36) NOT NULL,
    `FirstName` longtext CHARACTER SET utf8mb4 NULL,
    `LastName` longtext CHARACTER SET utf8mb4 NULL,
    `EmailAddress` longtext CHARACTER SET utf8mb4 NULL,
    `DateRegistered` datetime(6) NOT NULL,
    `DateConfirmed` datetime(6) NULL,
    `RegistrationStatus` int NOT NULL,
    `DateOfBirth` datetime(6) NOT NULL,
    CONSTRAINT `PK_AcademicallyRegistrations` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyResearchMethods` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ParentId` char(36) NULL,
    `ParentIdMap` longtext CHARACTER SET utf8mb4 NULL,
    `IsEditable` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyResearchMethods` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyResearchMethods_AcademicallyResearchMethods_Pare~` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyResearchMethods` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyServices` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyServices` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyServices2` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ParentId` char(36) NULL,
    `ParentIdMap` longtext CHARACTER SET utf8mb4 NULL,
    `IsEditable` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyServices2` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyServices2_AcademicallyServices2_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyServices2` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallySpokenLanguages` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallySpokenLanguages` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyStudentRatings` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `StudentId` bigint NOT NULL,
    `ExperienceType` int NOT NULL,
    `Comments` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyStudentRatings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentRatings_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyStudentRatings_AbpUsers_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallySubjects` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ReviewTime` datetime(6) NULL,
    `ReviewerUserId` bigint NULL,
    `ReviewStatus` int NOT NULL,
    CONSTRAINT `PK_AcademicallySubjects` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallySubjects_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyTimeZones` (
    `Id` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `DisplayOrder` int NOT NULL,
    CONSTRAINT `PK_AcademicallyTimeZones` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyTopics` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyTopics` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyTutorRatings` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `TutorId` bigint NOT NULL,
    `ExperienceType` int NOT NULL,
    `Comments` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyTutorRatings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyTutorRatings_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyTutorRatings_AbpUsers_TutorId` FOREIGN KEY (`TutorId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyTutorVerifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `CurrentStep` int NOT NULL,
    `Status` int NOT NULL,
    `ReviewTime` datetime(6) NULL,
    `ReviewerUserId` bigint NULL,
    CONSTRAINT `PK_AcademicallyTutorVerifications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyTutorVerifications_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyUniversities` (
    `Id` char(36) NOT NULL,
    `HesaId` longtext CHARACTER SET utf8mb4 NULL,
    `HeProvider` longtext CHARACTER SET utf8mb4 NULL,
    `UkPrn1` longtext CHARACTER SET utf8mb4 NULL,
    `UkPrn2` longtext CHARACTER SET utf8mb4 NULL,
    `CountryCode` longtext CHARACTER SET utf8mb4 NULL,
    `IsReviewed` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyUniversities` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyUserAvailabilities` (
    `Id` char(36) NOT NULL,
    `DayOfWeek` int NOT NULL,
    `IsAvailable` tinyint(1) NOT NULL,
    `StartTime` longtext CHARACTER SET utf8mb4 NULL,
    `EndTime` longtext CHARACTER SET utf8mb4 NULL,
    `UserId` bigint NOT NULL,
    CONSTRAINT `PK_AcademicallyUserAvailabilities` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserAvailabilities_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserFollowers` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `UserId` bigint NOT NULL,
    CONSTRAINT `PK_AcademicallyUserFollowers` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserFollowers_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyUserFollowers_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserPublications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `PublicationType` int NOT NULL,
    `Publisher` longtext CHARACTER SET utf8mb4 NULL,
    `PublicationDate` datetime(6) NOT NULL,
    `Abstract` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyUserPublications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserPublications_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyUserQualifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `ProfessionalCertificateOrAward` longtext CHARACTER SET utf8mb4 NULL,
    `ConferringOrganization` longtext CHARACTER SET utf8mb4 NULL,
    `Summary` longtext CHARACTER SET utf8mb4 NULL,
    `City` longtext CHARACTER SET utf8mb4 NULL,
    `Country` longtext CHARACTER SET utf8mb4 NULL,
    `StartYear` longtext CHARACTER SET utf8mb4 NULL,
    `EndYear` longtext CHARACTER SET utf8mb4 NULL,
    `GradeAttained` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyUserQualifications` PRIMARY KEY (`Id`)
);

CREATE TABLE `AcademicallyUserResearchInterests` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyUserResearchInterests` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserResearchInterests_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyUserResearchMethodologies` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyUserResearchMethodologies` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserResearchMethodologies_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyWorkHistories` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `JobTitle` longtext CHARACTER SET utf8mb4 NULL,
    `Company` longtext CHARACTER SET utf8mb4 NULL,
    `StartYear` int NOT NULL,
    `EndYear` int NOT NULL,
    `Country` longtext CHARACTER SET utf8mb4 NULL,
    `City` longtext CHARACTER SET utf8mb4 NULL,
    `Summary` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyWorkHistories` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkHistories_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyAcademicLevelQualifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `DisplayOrder` int NOT NULL,
    `AcademicLevelId` char(36) NOT NULL,
    `ReviewerUserId` bigint NULL,
    `ReviewTime` datetime(6) NULL,
    `ReviewStatus` int NOT NULL,
    CONSTRAINT `PK_AcademicallyAcademicLevelQualifications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyAcademicLevelQualifications_AcademicallyAcademic~` FOREIGN KEY (`AcademicLevelId`) REFERENCES `AcademicallyAcademicLevels` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyAcademicLevelQualifications_AbpUsers_CreatorUser~` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyAcademicLevelQualifications_AbpUsers_ReviewerUse~` FOREIGN KEY (`ReviewerUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCommentReactions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `CommentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCommentReactions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCommentReactions_AcademicallyComments_CommentId` FOREIGN KEY (`CommentId`) REFERENCES `AcademicallyComments` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCommentReactions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyConferenceSessionCandidates` (
    `Id` char(36) NOT NULL,
    `Value` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `ConferenceSessionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyConferenceSessionCandidates` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyConferenceSessionCandidates_AcademicallyConferen~` FOREIGN KEY (`ConferenceSessionId`) REFERENCES `AcademicallyConferenceSessions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyDbsCertificates` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `DbsNumber` longtext CHARACTER SET utf8mb4 NULL,
    `DateOfIssue` datetime(6) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyDbsCertificates` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyDbsCertificates_AcademicallyDocuments_DocumentId` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyPassportVerifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Status` int NOT NULL,
    `DocumentId` char(36) NOT NULL,
    `ReviewerUserId` char(36) NULL,
    `ReviewTime` datetime(6) NULL,
    CONSTRAINT `PK_AcademicallyPassportVerifications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyPassportVerifications_AcademicallyDocuments_Docu~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyPhotoIdVerifications` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Status` int NOT NULL,
    `DocumentId` char(36) NOT NULL,
    `ReviewerUserId` char(36) NULL,
    `ReviewTime` datetime(6) NULL,
    CONSTRAINT `PK_AcademicallyPhotoIdVerifications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyPhotoIdVerifications_AcademicallyDocuments_Docum~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyReferences` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Forename` longtext CHARACTER SET utf8mb4 NULL,
    `Surname` longtext CHARACTER SET utf8mb4 NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `Phone` longtext CHARACTER SET utf8mb4 NULL,
    `Relationship` int NOT NULL,
    `DocumentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyReferences` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyReferences_AcademicallyDocuments_DocumentId` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyForumReplies` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `ForumId` char(36) NOT NULL,
    `Message` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyForumReplies` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyForumReplies_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyForumReplies_AcademicallyForums_ForumId` FOREIGN KEY (`ForumId`) REFERENCES `AcademicallyForums` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyProjectAvailabilities` (
    `Id` char(36) NOT NULL,
    `ProjectId` char(36) NOT NULL,
    `DayOfWeek` int NOT NULL,
    `StartTime` longtext CHARACTER SET utf8mb4 NULL,
    `EndTime` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyProjectAvailabilities` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyProjectAvailabilities_AcademicallyProjects_Proje~` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyProjectDocuments` (
    `Id` char(36) NOT NULL,
    `ProjectId` char(36) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyProjectDocuments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyProjectDocuments_AcademicallyDocuments_DocumentId` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyProjectDocuments_AcademicallyProjects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyProjectInvitations` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `ProjectId` char(36) NOT NULL,
    `TutorId` bigint NOT NULL,
    CONSTRAINT `PK_AcademicallyProjectInvitations` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyProjectInvitations_AcademicallyProjects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyProjectInvitations_AbpUsers_TutorId` FOREIGN KEY (`TutorId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyProjectOffers` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `ProjectId` char(36) NOT NULL,
    `IsHourlySessionOffered` tinyint(1) NOT NULL,
    `HourlyRate` decimal(65,30) NOT NULL,
    `IsDiscountedHourlySessionOffered` tinyint(1) NOT NULL,
    `DiscountedHours` double NOT NULL,
    `DiscountedHourlyRate` decimal(65,30) NOT NULL,
    `IsFreeSessionOffered` tinyint(1) NOT NULL,
    `IsAccepted` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyProjectOffers` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyProjectOffers_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyProjectOffers_AcademicallyProjects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyQuestionReactions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `QuestionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyQuestionReactions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyQuestionReactions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyQuestionReactions_AcademicallyQuestions_Question~` FOREIGN KEY (`QuestionId`) REFERENCES `AcademicallyQuestions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyServiceMappings` (
    `Id` char(36) NOT NULL,
    `Node1Id` char(36) NULL,
    `Node2Id` char(36) NULL,
    `Node3Id` char(36) NULL,
    CONSTRAINT `PK_AcademicallyServiceMappings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyServiceMappings_AcademicallyServices_Node3Id` FOREIGN KEY (`Node3Id`) REFERENCES `AcademicallyServices` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyArticles` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    `ParentId` char(36) NULL,
    `ThumbnailDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `IsVisible` tinyint(1) NOT NULL,
    `CommentSetting` int NOT NULL,
    `CommentModeration` tinyint(1) NOT NULL,
    `CustomUrl` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `DelayType` int NULL,
    `DelayValue` longtext CHARACTER SET utf8mb4 NULL,
    `Price` decimal(65,30) NOT NULL,
    `PricingType` int NOT NULL,
    CONSTRAINT `PK_AcademicallyArticles` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyArticles_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyArticles_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyArticles_AcademicallyArticles_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyArticles` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyArticles_AcademicallyDocuments_ThumbnailDocument~` FOREIGN KEY (`ThumbnailDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCoachings` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `Status` int NOT NULL,
    `ParentId` char(36) NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `ThumbnailDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `PricingType` int NULL,
    `Price` decimal(65,30) NULL,
    `ReplayType` int NULL,
    `QuestionsEnabled` tinyint(1) NULL,
    `QuestionType` int NULL,
    `AttendeesCanUpvote` tinyint(1) NULL,
    `AttendeesCanRespond` tinyint(1) NULL,
    `ChatEnabled` tinyint(1) NULL,
    `CustomWebinarUrl` longtext CHARACTER SET utf8mb4 NULL,
    `RegistrationEmailNotification` tinyint(1) NULL,
    `TwentyFourHourReminderNotification` tinyint(1) NULL,
    `OneHourReminderNotification` tinyint(1) NULL,
    `FifteenMinuteReminderNotification` tinyint(1) NULL,
    `ReplayFollowUpNotification` tinyint(1) NULL,
    `Visible` tinyint(1) NULL,
    `Opened` tinyint(1) NULL,
    `CohostsEnableMicrophone` tinyint(1) NOT NULL,
    `CohostsEnableWebCam` tinyint(1) NOT NULL,
    `CohostsEnablePresentationTools` tinyint(1) NOT NULL,
    `CohostsEnableSpeakRequests` tinyint(1) NOT NULL,
    `CohostsViewRegistrants` tinyint(1) NOT NULL,
    `CohostsManageGuests` tinyint(1) NOT NULL,
    `CohostsManageGuestSettings` tinyint(1) NOT NULL,
    `CohostsManageAudience` tinyint(1) NOT NULL,
    `CohostsManageAudienceSettings` tinyint(1) NOT NULL,
    `CohostsChatPublicly` tinyint(1) NOT NULL,
    `CohostsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `CohostsChatPrivately` tinyint(1) NOT NULL,
    `CohostsChatPrivatelySelected` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToUpvote` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToRespond` tinyint(1) NOT NULL,
    `CohostsCreatePolls` tinyint(1) NOT NULL,
    `CohostsCreateOffers` tinyint(1) NOT NULL,
    `CohostsUploadHandouts` tinyint(1) NOT NULL,
    `GuestsEnableMicrophone` tinyint(1) NOT NULL,
    `GuestsEnableWebCam` tinyint(1) NOT NULL,
    `GuestsEnablePresentationTools` tinyint(1) NOT NULL,
    `GuestsEnableSpeakRequests` tinyint(1) NOT NULL,
    `GuestsViewRegistrants` tinyint(1) NOT NULL,
    `GuestsManageAudience` tinyint(1) NOT NULL,
    `GuestsManageAudienceSettings` tinyint(1) NOT NULL,
    `GuestsChatPublicly` tinyint(1) NOT NULL,
    `GuestsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `GuestsChatPrivately` tinyint(1) NOT NULL,
    `GuestsChatPrivatelySelected` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToUpvote` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToRespond` tinyint(1) NOT NULL,
    `GuestsCreatePolls` tinyint(1) NOT NULL,
    `GuestsCreateOffers` tinyint(1) NOT NULL,
    `GuestsCreateHandouts` tinyint(1) NOT NULL,
    `AudienceEnableMicrophone` tinyint(1) NOT NULL,
    `AudienceEnableWebCam` tinyint(1) NOT NULL,
    `AudienceEnablePresentationTools` tinyint(1) NOT NULL,
    `AudienceEnableSpeakRequests` tinyint(1) NOT NULL,
    `AudienceViewAudience` tinyint(1) NOT NULL,
    `AudienceChatPublicly` tinyint(1) NOT NULL,
    `AudienceChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `AudienceChatPrivately` tinyint(1) NOT NULL,
    `AudienceChatPrivatelySelected` tinyint(1) NOT NULL,
    `AudienceAskQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToUpvote` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToRespond` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsWithAdmins` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsAllowFollowUpResponse` tinyint(1) NOT NULL,
    `AudienceEnablePollsTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTabDisplayNoOfPurchases` tinyint(1) NOT NULL,
    `AudienceEnableHandoutsTab` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyCoachings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachings_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCoachings_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCoachings_AcademicallyCoachings_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyCoachings` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCoachings_AcademicallyDocuments_ThumbnailDocumen~` FOREIGN KEY (`ThumbnailDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCourses` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Subtitle` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    `Price` decimal(65,30) NOT NULL,
    `Type` int NOT NULL,
    `IsVisible` tinyint(1) NOT NULL,
    `IsOpen` tinyint(1) NOT NULL,
    `ImageDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `CurrencyId` char(36) NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `PricingType` int NULL,
    `NumberOfPlaces` int NULL,
    `StartDate` datetime(6) NULL,
    `StartTime` longtext CHARACTER SET utf8mb4 NULL,
    `EndDate` datetime(6) NULL,
    `EndTime` longtext CHARACTER SET utf8mb4 NULL,
    `CommentsVisibility` int NULL,
    `CommentsNeedAdminApproval` tinyint(1) NULL,
    CONSTRAINT `PK_AcademicallyCourses` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourses_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourses_AcademicallyCurrencies_CurrencyId` FOREIGN KEY (`CurrencyId`) REFERENCES `AcademicallyCurrencies` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourses_AcademicallyDocuments_ImageDocumentId` FOREIGN KEY (`ImageDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourses_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyEvents` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `Status` int NOT NULL,
    `ParentId` char(36) NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `ThumbnailDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `PricingType` int NULL,
    `Price` decimal(65,30) NULL,
    `FrequencyType` int NULL,
    `EventDateTime` datetime(6) NULL,
    `EndDate` datetime(6) NULL,
    `Duration` int NULL,
    `ReplayType` int NULL,
    `QuestionsEnabled` tinyint(1) NULL,
    `QuestionType` int NULL,
    `AttendeesCanUpvote` tinyint(1) NULL,
    `AttendeesCanRespond` tinyint(1) NULL,
    `ChatEnabled` tinyint(1) NULL,
    `CustomWebinarUrl` longtext CHARACTER SET utf8mb4 NULL,
    `RegistrationEmailNotification` tinyint(1) NULL,
    `TwentyFourHourReminderNotification` tinyint(1) NULL,
    `OneHourReminderNotification` tinyint(1) NULL,
    `FifteenMinuteReminderNotification` tinyint(1) NULL,
    `ReplayFollowUpNotification` tinyint(1) NULL,
    `Visible` tinyint(1) NULL,
    `Opened` tinyint(1) NULL,
    `DelayType` int NULL,
    `DelayValue` longtext CHARACTER SET utf8mb4 NULL,
    `RecursionType` int NOT NULL,
    `TimesPerDay` int NULL,
    `SessionTimes` longtext CHARACTER SET utf8mb4 NULL,
    `SessionDaysOfWeek` longtext CHARACTER SET utf8mb4 NULL,
    `SessionDaysOfMonth` longtext CHARACTER SET utf8mb4 NULL,
    `CohostsEnableMicrophone` tinyint(1) NOT NULL,
    `CohostsEnableWebCam` tinyint(1) NOT NULL,
    `CohostsEnablePresentationTools` tinyint(1) NOT NULL,
    `CohostsEnableSpeakRequests` tinyint(1) NOT NULL,
    `CohostsViewRegistrants` tinyint(1) NOT NULL,
    `CohostsManageGuests` tinyint(1) NOT NULL,
    `CohostsManageGuestSettings` tinyint(1) NOT NULL,
    `CohostsManageAudience` tinyint(1) NOT NULL,
    `CohostsManageAudienceSettings` tinyint(1) NOT NULL,
    `CohostsChatPublicly` tinyint(1) NOT NULL,
    `CohostsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `CohostsChatPrivately` tinyint(1) NOT NULL,
    `CohostsChatPrivatelySelected` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToUpvote` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToRespond` tinyint(1) NOT NULL,
    `CohostsCreatePolls` tinyint(1) NOT NULL,
    `CohostsCreateOffers` tinyint(1) NOT NULL,
    `CohostsUploadHandouts` tinyint(1) NOT NULL,
    `GuestsEnableMicrophone` tinyint(1) NOT NULL,
    `GuestsEnableWebCam` tinyint(1) NOT NULL,
    `GuestsEnablePresentationTools` tinyint(1) NOT NULL,
    `GuestsEnableSpeakRequests` tinyint(1) NOT NULL,
    `GuestsViewRegistrants` tinyint(1) NOT NULL,
    `GuestsManageAudience` tinyint(1) NOT NULL,
    `GuestsManageAudienceSettings` tinyint(1) NOT NULL,
    `GuestsChatPublicly` tinyint(1) NOT NULL,
    `GuestsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `GuestsChatPrivately` tinyint(1) NOT NULL,
    `GuestsChatPrivatelySelected` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToUpvote` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToRespond` tinyint(1) NOT NULL,
    `GuestsCreatePolls` tinyint(1) NOT NULL,
    `GuestsCreateOffers` tinyint(1) NOT NULL,
    `GuestsCreateHandouts` tinyint(1) NOT NULL,
    `AudienceEnableMicrophone` tinyint(1) NOT NULL,
    `AudienceEnableWebCam` tinyint(1) NOT NULL,
    `AudienceEnablePresentationTools` tinyint(1) NOT NULL,
    `AudienceEnableSpeakRequests` tinyint(1) NOT NULL,
    `AudienceViewAudience` tinyint(1) NOT NULL,
    `AudienceChatPublicly` tinyint(1) NOT NULL,
    `AudienceChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `AudienceChatPrivately` tinyint(1) NOT NULL,
    `AudienceChatPrivatelySelected` tinyint(1) NOT NULL,
    `AudienceAskQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToUpvote` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToRespond` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsWithAdmins` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsAllowFollowUpResponse` tinyint(1) NOT NULL,
    `AudienceEnablePollsTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTabDisplayNoOfPurchases` tinyint(1) NOT NULL,
    `AudienceEnableHandoutsTab` tinyint(1) NOT NULL,
    `AutoAdmitAttendees` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyEvents` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEvents_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEvents_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEvents_AcademicallyEvents_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEvents_AcademicallyDocuments_ThumbnailDocumentId` FOREIGN KEY (`ThumbnailDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyUserSpokenLanguages` (
    `Id` char(36) NOT NULL,
    `UserId` bigint NOT NULL,
    `SpokenLanguageId` char(36) NOT NULL,
    `Proficiency` int NOT NULL,
    CONSTRAINT `PK_AcademicallyUserSpokenLanguages` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserSpokenLanguages_AcademicallySpokenLanguages_~` FOREIGN KEY (`SpokenLanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserSpokenLanguages_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyVideos` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    `ParentId` char(36) NULL,
    `DocumentId` char(36) NULL,
    `ThumbnailDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `IsVisible` tinyint(1) NOT NULL,
    `CommentSetting` int NOT NULL,
    `CommentModeration` tinyint(1) NOT NULL,
    `CustomUrl` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `Price` decimal(65,30) NOT NULL,
    `PricingType` int NOT NULL,
    `DelayType` int NULL,
    `DelayValue` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyVideos` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyVideos_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyVideos_AcademicallyDocuments_DocumentId` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyVideos_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyVideos_AcademicallyVideos_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyVideos` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyVideos_AcademicallyDocuments_ThumbnailDocumentId` FOREIGN KEY (`ThumbnailDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyWorkshops` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `Status` int NOT NULL,
    `ParentId` char(36) NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `ThumbnailDocumentId` char(36) NULL,
    `LanguageId` char(36) NULL,
    `PricingType` int NULL,
    `Price` decimal(65,30) NULL,
    `FrequencyType` int NULL,
    `WorkshopDateTime` datetime(6) NULL,
    `EndDate` datetime(6) NULL,
    `Duration` int NULL,
    `DelayType` int NULL,
    `DelayValue` longtext CHARACTER SET utf8mb4 NULL,
    `RecursionType` int NOT NULL,
    `TimesPerDay` int NULL,
    `SessionTimes` longtext CHARACTER SET utf8mb4 NULL,
    `SessionDaysOfWeek` longtext CHARACTER SET utf8mb4 NULL,
    `SessionDaysOfMonth` longtext CHARACTER SET utf8mb4 NULL,
    `NumberOfAttendees` int NULL,
    `ReplayType` int NULL,
    `QuestionsEnabled` tinyint(1) NULL,
    `QuestionType` int NULL,
    `AttendeesCanUpvote` tinyint(1) NULL,
    `AttendeesCanRespond` tinyint(1) NULL,
    `ChatEnabled` tinyint(1) NULL,
    `CustomWebinarUrl` longtext CHARACTER SET utf8mb4 NULL,
    `RegistrationEmailNotification` tinyint(1) NULL,
    `TwentyFourHourReminderNotification` tinyint(1) NULL,
    `OneHourReminderNotification` tinyint(1) NULL,
    `FifteenMinuteReminderNotification` tinyint(1) NULL,
    `ReplayFollowUpNotification` tinyint(1) NULL,
    `Visible` tinyint(1) NULL,
    `Opened` tinyint(1) NULL,
    `CohostsEnableMicrophone` tinyint(1) NOT NULL,
    `CohostsEnableWebCam` tinyint(1) NOT NULL,
    `CohostsEnablePresentationTools` tinyint(1) NOT NULL,
    `CohostsEnableSpeakRequests` tinyint(1) NOT NULL,
    `CohostsViewRegistrants` tinyint(1) NOT NULL,
    `CohostsManageGuests` tinyint(1) NOT NULL,
    `CohostsManageGuestSettings` tinyint(1) NOT NULL,
    `CohostsManageAudience` tinyint(1) NOT NULL,
    `CohostsManageAudienceSettings` tinyint(1) NOT NULL,
    `CohostsChatPublicly` tinyint(1) NOT NULL,
    `CohostsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `CohostsChatPrivately` tinyint(1) NOT NULL,
    `CohostsChatPrivatelySelected` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToUpvote` tinyint(1) NOT NULL,
    `CohostsAllowCohostsToRespond` tinyint(1) NOT NULL,
    `CohostsCreatePolls` tinyint(1) NOT NULL,
    `CohostsCreateOffers` tinyint(1) NOT NULL,
    `CohostsUploadHandouts` tinyint(1) NOT NULL,
    `GuestsEnableMicrophone` tinyint(1) NOT NULL,
    `GuestsEnableWebCam` tinyint(1) NOT NULL,
    `GuestsEnablePresentationTools` tinyint(1) NOT NULL,
    `GuestsEnableSpeakRequests` tinyint(1) NOT NULL,
    `GuestsViewRegistrants` tinyint(1) NOT NULL,
    `GuestsManageAudience` tinyint(1) NOT NULL,
    `GuestsManageAudienceSettings` tinyint(1) NOT NULL,
    `GuestsChatPublicly` tinyint(1) NOT NULL,
    `GuestsChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `GuestsChatPrivately` tinyint(1) NOT NULL,
    `GuestsChatPrivatelySelected` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToUpvote` tinyint(1) NOT NULL,
    `GuestsAllowGuestsToRespond` tinyint(1) NOT NULL,
    `GuestsCreatePolls` tinyint(1) NOT NULL,
    `GuestsCreateOffers` tinyint(1) NOT NULL,
    `GuestsCreateHandouts` tinyint(1) NOT NULL,
    `AudienceEnableMicrophone` tinyint(1) NOT NULL,
    `AudienceEnableWebCam` tinyint(1) NOT NULL,
    `AudienceEnablePresentationTools` tinyint(1) NOT NULL,
    `AudienceEnableSpeakRequests` tinyint(1) NOT NULL,
    `AudienceViewAudience` tinyint(1) NOT NULL,
    `AudienceChatPublicly` tinyint(1) NOT NULL,
    `AudienceChatPubliclyTagMembers` tinyint(1) NOT NULL,
    `AudienceChatPrivately` tinyint(1) NOT NULL,
    `AudienceChatPrivatelySelected` tinyint(1) NOT NULL,
    `AudienceAskQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestions` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToUpvote` tinyint(1) NOT NULL,
    `AudienceAskPublicQuestionsAllowAudienceToRespond` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsWithAdmins` tinyint(1) NOT NULL,
    `AudienceAskPrivateQuestionsAllowFollowUpResponse` tinyint(1) NOT NULL,
    `AudienceEnablePollsTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTab` tinyint(1) NOT NULL,
    `AudienceEnableOffersTabDisplayNoOfPurchases` tinyint(1) NOT NULL,
    `AudienceEnableHandoutsTab` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyWorkshops` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshops_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshops_AcademicallySpokenLanguages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `AcademicallySpokenLanguages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshops_AcademicallyWorkshops_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyWorkshops` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshops_AcademicallyDocuments_ThumbnailDocumen~` FOREIGN KEY (`ThumbnailDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyServiceSubjects` (
    `ServiceId` char(36) NOT NULL,
    `SubjectId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyServiceSubjects` PRIMARY KEY (`ServiceId`, `SubjectId`),
    CONSTRAINT `FK_AcademicallyServiceSubjects_AcademicallyServices_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `AcademicallyServices` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyServiceSubjects_AcademicallySubjects_SubjectId` FOREIGN KEY (`SubjectId`) REFERENCES `AcademicallySubjects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyForumTopics` (
    `Id` char(36) NOT NULL,
    `ForumId` char(36) NOT NULL,
    `TopicId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyForumTopics` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyForumTopics_AcademicallyForums_ForumId` FOREIGN KEY (`ForumId`) REFERENCES `AcademicallyForums` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyForumTopics_AcademicallyTopics_TopicId` FOREIGN KEY (`TopicId`) REFERENCES `AcademicallyTopics` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyTutorRatingAreas` (
    `Id` char(36) NOT NULL,
    `TutorRatingId` char(36) NOT NULL,
    `AreaType` int NOT NULL,
    `Rating` int NOT NULL,
    CONSTRAINT `PK_AcademicallyTutorRatingAreas` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyTutorRatingAreas_AcademicallyTutorRatings_TutorR~` FOREIGN KEY (`TutorRatingId`) REFERENCES `AcademicallyTutorRatings` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyTutorVerificationSteps` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Step` int NOT NULL,
    `Status` int NOT NULL,
    `ReviewTime` datetime(6) NULL,
    `ReviewerUserId` bigint NULL,
    `TutorVerificationId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyTutorVerificationSteps` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyTutorVerificationSteps_AcademicallyTutorVerifica~` FOREIGN KEY (`TutorVerificationId`) REFERENCES `AcademicallyTutorVerifications` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserEducations` (
    `Id` char(36) NOT NULL,
    `UserId` bigint NOT NULL,
    `UniversityId` char(36) NOT NULL,
    `City` longtext CHARACTER SET utf8mb4 NULL,
    `StartYear` longtext CHARACTER SET utf8mb4 NULL,
    `EndYear` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyUserEducations` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserEducations_AcademicallyUniversities_Universi~` FOREIGN KEY (`UniversityId`) REFERENCES `AcademicallyUniversities` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserEducations_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserPublicationTags` (
    `Id` char(36) NOT NULL,
    `UserPublicationId` char(36) NOT NULL,
    `PublicationTagId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserPublicationTags` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserPublicationTags_AcademicallyPublicationTags_~` FOREIGN KEY (`PublicationTagId`) REFERENCES `AcademicallyPublicationTags` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserPublicationTags_AcademicallyUserPublications~` FOREIGN KEY (`UserPublicationId`) REFERENCES `AcademicallyUserPublications` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserQualificationDocuments` (
    `Id` char(36) NOT NULL,
    `UserQualificationId` char(36) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    `IsReviewed` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserQualificationDocuments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserQualificationDocuments_AcademicallyDocuments~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserQualificationDocuments_AcademicallyUserQuali~` FOREIGN KEY (`UserQualificationId`) REFERENCES `AcademicallyUserQualifications` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserResearchInterestDisciplineTaxonomies` (
    `Id` char(36) NOT NULL,
    `UserResearchInterestId` char(36) NOT NULL,
    `DisciplineTaxonomyId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserResearchInterestDisciplineTaxonomies` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserResearchInterestDisciplineTaxonomies_Academi~` FOREIGN KEY (`DisciplineTaxonomyId`) REFERENCES `AcademicallyDisciplineTaxonomies` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserResearchInterestDisciplineTaxonomies_Academ~1` FOREIGN KEY (`UserResearchInterestId`) REFERENCES `AcademicallyUserResearchInterests` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserResearchMethodologyResearchMethods` (
    `Id` char(36) NOT NULL,
    `UserResearchMethodologyId` char(36) NOT NULL,
    `ResearchMethodId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserResearchMethodologyResearchMethods` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserResearchMethodologyResearchMethods_Academica~` FOREIGN KEY (`ResearchMethodId`) REFERENCES `AcademicallyResearchMethods` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserResearchMethodologyResearchMethods_Academic~1` FOREIGN KEY (`UserResearchMethodologyId`) REFERENCES `AcademicallyUserResearchMethodologies` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCalendarEvents` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `StartTime` datetime(6) NOT NULL,
    `EndTime` datetime(6) NOT NULL,
    `Recurrence` int NOT NULL,
    `ProjectId` char(36) NULL,
    `ProjectOfferId` char(36) NULL,
    `IsBusy` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyCalendarEvents` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCalendarEvents_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCalendarEvents_AcademicallyProjects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCalendarEvents_AcademicallyProjectOffers_Project~` FOREIGN KEY (`ProjectOfferId`) REFERENCES `AcademicallyProjectOffers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyUserServices` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `ExpertiseLevel` int NOT NULL,
    `ServiceMappingId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserServices` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserServices_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyUserServices_AcademicallyServiceMappings_Service~` FOREIGN KEY (`ServiceMappingId`) REFERENCES `AcademicallyServiceMappings` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyStudentArticles` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `ArticleId` char(36) NOT NULL,
    `SaveOnly` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyStudentArticles` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentArticles_AcademicallyArticles_ArticleId` FOREIGN KEY (`ArticleId`) REFERENCES `AcademicallyArticles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyStudentArticles_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCoachingPolls` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `CoachingId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCoachingPolls` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachingPolls_AcademicallyCoachings_CoachingId` FOREIGN KEY (`CoachingId`) REFERENCES `AcademicallyCoachings` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCoachingPolls_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCoachingPresenters` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `CoachingId` char(36) NOT NULL,
    `UserId` bigint NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    CONSTRAINT `PK_AcademicallyCoachingPresenters` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachingPresenters_AcademicallyCoachings_Coachin~` FOREIGN KEY (`CoachingId`) REFERENCES `AcademicallyCoachings` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCoachingPresenters_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCoachingPresenters_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCoachingResources` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `CoachingId` char(36) NOT NULL,
    `DocumentId` char(36) NULL,
    CONSTRAINT `PK_AcademicallyCoachingResources` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachingResources_AcademicallyCoachings_Coaching~` FOREIGN KEY (`CoachingId`) REFERENCES `AcademicallyCoachings` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCoachingResources_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCoachingResources_AcademicallyDocuments_Document~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCourseRatings` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `CourseId` char(36) NOT NULL,
    `ExperienceType` int NOT NULL,
    `Comments` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyCourseRatings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseRatings_AcademicallyCourses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `AcademicallyCourses` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCourseRatings_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCourseSections` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `Status` int NOT NULL,
    `DisplayOrder` int NOT NULL,
    `CourseId` char(36) NOT NULL,
    `ParentId` char(36) NULL,
    `IsVisible` tinyint(1) NOT NULL,
    `IsAssignmentEnabled` tinyint(1) NOT NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Categories` longtext CHARACTER SET utf8mb4 NULL,
    `ImageDocumentId` char(36) NULL,
    `ApproximateLessonDuration` longtext CHARACTER SET utf8mb4 NULL,
    `DripType` int NULL,
    `DripValue` longtext CHARACTER SET utf8mb4 NULL,
    `IsSendEmailEnabled` tinyint(1) NULL,
    `EmailSubject` longtext CHARACTER SET utf8mb4 NULL,
    `EmailMessage` longtext CHARACTER SET utf8mb4 NULL,
    `CommentSetting` int NULL,
    `IsCommentModerationEnabled` tinyint(1) NULL,
    `IsStorePreviewEnabled` tinyint(1) NULL,
    `IsPrerequsite` tinyint(1) NOT NULL,
    `AreAllPrerequisite` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyCourseSections` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseSections_AcademicallyCourses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `AcademicallyCourses` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCourseSections_AcademicallyDocuments_ImageDocume~` FOREIGN KEY (`ImageDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourseSections_AcademicallyCourseSections_Parent~` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyCourseSections` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyStudentCourses` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `CourseId` char(36) NOT NULL,
    `Progress` decimal(65,30) NOT NULL,
    CONSTRAINT `PK_AcademicallyStudentCourses` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentCourses_AcademicallyCourses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `AcademicallyCourses` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyStudentCourses_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyEventPolls` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `EventId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyEventPolls` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventPolls_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventPolls_AcademicallyEvents_EventId` FOREIGN KEY (`EventId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyEventPresenters` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `EventId` char(36) NOT NULL,
    `UserId` bigint NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    CONSTRAINT `PK_AcademicallyEventPresenters` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventPresenters_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventPresenters_AcademicallyEvents_EventId` FOREIGN KEY (`EventId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyEventPresenters_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyEventResources` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `EventId` char(36) NOT NULL,
    `DocumentId` char(36) NULL,
    CONSTRAINT `PK_AcademicallyEventResources` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventResources_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventResources_AcademicallyDocuments_DocumentId` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventResources_AcademicallyEvents_EventId` FOREIGN KEY (`EventId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyStudentEvents` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `EventId` char(36) NOT NULL,
    `SaveOnly` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyStudentEvents` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentEvents_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyStudentEvents_AcademicallyEvents_EventId` FOREIGN KEY (`EventId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyStudentVideos` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `VideoId` char(36) NOT NULL,
    `SaveOnly` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyStudentVideos` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentVideos_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyStudentVideos_AcademicallyVideos_VideoId` FOREIGN KEY (`VideoId`) REFERENCES `AcademicallyVideos` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyWorkshopPolls` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `WorkshopId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyWorkshopPolls` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshopPolls_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopPolls_AcademicallyWorkshops_WorkshopId` FOREIGN KEY (`WorkshopId`) REFERENCES `AcademicallyWorkshops` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyWorkshopPresenters` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `WorkshopId` char(36) NOT NULL,
    `UserId` bigint NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    CONSTRAINT `PK_AcademicallyWorkshopPresenters` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshopPresenters_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopPresenters_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopPresenters_AcademicallyWorkshops_Worksho~` FOREIGN KEY (`WorkshopId`) REFERENCES `AcademicallyWorkshops` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyWorkshopResources` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `WorkshopId` char(36) NOT NULL,
    `DocumentId` char(36) NULL,
    CONSTRAINT `PK_AcademicallyWorkshopResources` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshopResources_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopResources_AcademicallyDocuments_Document~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopResources_AcademicallyWorkshops_Workshop~` FOREIGN KEY (`WorkshopId`) REFERENCES `AcademicallyWorkshops` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyTutorVerificationStepReviewers` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `OldStatus` int NOT NULL,
    `NewStatus` int NOT NULL,
    `Comments` longtext CHARACTER SET utf8mb4 NULL,
    `TutorVerificationStepId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyTutorVerificationStepReviewers` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyTutorVerificationStepReviewers_AcademicallyTutor~` FOREIGN KEY (`TutorVerificationStepId`) REFERENCES `AcademicallyTutorVerificationSteps` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserEducationCourses` (
    `Id` char(36) NOT NULL,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Grade` longtext CHARACTER SET utf8mb4 NULL,
    `AcademicLevelId` char(36) NOT NULL,
    `AcademicLevelQualificationId` char(36) NOT NULL,
    `UserEducationId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserEducationCourses` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserEducationCourses_AcademicallyAcademicLevels_~` FOREIGN KEY (`AcademicLevelId`) REFERENCES `AcademicallyAcademicLevels` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserEducationCourses_AcademicallyAcademicLevelQu~` FOREIGN KEY (`AcademicLevelQualificationId`) REFERENCES `AcademicallyAcademicLevelQualifications` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserEducationCourses_AcademicallyUserEducations_~` FOREIGN KEY (`UserEducationId`) REFERENCES `AcademicallyUserEducations` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserEducationDocuments` (
    `Id` char(36) NOT NULL,
    `UserEducationId` char(36) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    `Category` longtext CHARACTER SET utf8mb4 NULL,
    `IsReviewed` tinyint(1) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserEducationDocuments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserEducationDocuments_AcademicallyDocuments_Doc~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserEducationDocuments_AcademicallyUserEducation~` FOREIGN KEY (`UserEducationId`) REFERENCES `AcademicallyUserEducations` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyConversationGroups` (
    `Id` char(36) NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `ProjectId` char(36) NULL,
    `CalendarEventId` char(36) NULL,
    `LastConversationCreationTime` datetime(6) NULL,
    `LastConversationCreatorUserId` bigint NULL,
    `LastConversationMessage` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyConversationGroups` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyConversationGroups_AcademicallyCalendarEvents_Ca~` FOREIGN KEY (`CalendarEventId`) REFERENCES `AcademicallyCalendarEvents` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyConversationGroups_AcademicallyProjects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `AcademicallyProjects` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyRescheduleComments` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `OldStartTime` datetime(6) NOT NULL,
    `OldEndTime` datetime(6) NOT NULL,
    `NewStartTime` datetime(6) NOT NULL,
    `NewEndTime` datetime(6) NOT NULL,
    `Comments` longtext CHARACTER SET utf8mb4 NULL,
    `CalendarEventId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyRescheduleComments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyRescheduleComments_AcademicallyCalendarEvents_Ca~` FOREIGN KEY (`CalendarEventId`) REFERENCES `AcademicallyCalendarEvents` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyRescheduleComments_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallySessions` (
    `Id` char(36) NOT NULL,
    `Offer` longtext CHARACTER SET utf8mb4 NULL,
    `Answer` longtext CHARACTER SET utf8mb4 NULL,
    `CalendarEventId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallySessions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallySessions_AcademicallyCalendarEvents_CalendarEven~` FOREIGN KEY (`CalendarEventId`) REFERENCES `AcademicallyCalendarEvents` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserCalendarEvents` (
    `Id` char(36) NOT NULL,
    `UserId` bigint NOT NULL,
    `CalendarEventId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserCalendarEvents` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserCalendarEvents_AcademicallyCalendarEvents_Ca~` FOREIGN KEY (`CalendarEventId`) REFERENCES `AcademicallyCalendarEvents` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserCalendarEvents_AbpUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserServiceDisciplineTaxonomies` (
    `Id` char(36) NOT NULL,
    `UserServiceId` char(36) NOT NULL,
    `DisciplineTaxonomyId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserServiceDisciplineTaxonomies` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserServiceDisciplineTaxonomies_AcademicallyDisc~` FOREIGN KEY (`DisciplineTaxonomyId`) REFERENCES `AcademicallyDisciplineTaxonomies` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserServiceDisciplineTaxonomies_AcademicallyUser~` FOREIGN KEY (`UserServiceId`) REFERENCES `AcademicallyUserServices` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyUserServiceSubjects` (
    `Id` char(36) NOT NULL,
    `UserServiceId` char(36) NOT NULL,
    `SubjectId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyUserServiceSubjects` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyUserServiceSubjects_AcademicallySubjects_Subject~` FOREIGN KEY (`SubjectId`) REFERENCES `AcademicallySubjects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyUserServiceSubjects_AcademicallyUserServices_Use~` FOREIGN KEY (`UserServiceId`) REFERENCES `AcademicallyUserServices` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCoachingPollQuestions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `MinimumResponse` int NULL,
    `MaximumResponse` int NULL,
    `ShareResults` tinyint(1) NOT NULL,
    `CoachingPollId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCoachingPollQuestions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachingPollQuestions_AcademicallyCoachingPolls_~` FOREIGN KEY (`CoachingPollId`) REFERENCES `AcademicallyCoachingPolls` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCoachingPollQuestions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCourseRatingAreas` (
    `Id` char(36) NOT NULL,
    `CourseRatingId` char(36) NOT NULL,
    `AreaType` int NOT NULL,
    `Rating` int NOT NULL,
    CONSTRAINT `PK_AcademicallyCourseRatingAreas` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseRatingAreas_AcademicallyCourseRatings_Cour~` FOREIGN KEY (`CourseRatingId`) REFERENCES `AcademicallyCourseRatings` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCourseSectionPages` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `PageContent` longtext CHARACTER SET utf8mb4 NULL,
    `CourseSectionId` char(36) NOT NULL,
    `ImageDocumentId` char(36) NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Duration` longtext CHARACTER SET utf8mb4 NULL,
    `CategoriesTags` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AcademicallyCourseSectionPages` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseSectionPages_AcademicallyCourseSections_Co~` FOREIGN KEY (`CourseSectionId`) REFERENCES `AcademicallyCourseSections` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCourseSectionPages_AcademicallyDocuments_ImageDo~` FOREIGN KEY (`ImageDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallyCourseConversations` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Message` longtext CHARACTER SET utf8mb4 NULL,
    `IsSeen` tinyint(1) NOT NULL,
    `StudentCourseId` char(36) NOT NULL,
    `ParentId` char(36) NULL,
    CONSTRAINT `PK_AcademicallyCourseConversations` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseConversations_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourseConversations_AcademicallyCourseConversati~` FOREIGN KEY (`ParentId`) REFERENCES `AcademicallyCourseConversations` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourseConversations_AcademicallyStudentCourses_S~` FOREIGN KEY (`StudentCourseId`) REFERENCES `AcademicallyStudentCourses` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyStudentCourseSections` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Status` int NOT NULL,
    `StudentCourseId` char(36) NOT NULL,
    `CourseSectionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyStudentCourseSections` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyStudentCourseSections_AcademicallyCourseSections~` FOREIGN KEY (`CourseSectionId`) REFERENCES `AcademicallyCourseSections` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyStudentCourseSections_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyStudentCourseSections_AcademicallyStudentCourses~` FOREIGN KEY (`StudentCourseId`) REFERENCES `AcademicallyStudentCourses` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyEventPollQuestions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `MinimumResponse` int NULL,
    `MaximumResponse` int NULL,
    `ShareResults` tinyint(1) NOT NULL,
    `EventPollId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyEventPollQuestions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventPollQuestions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventPollQuestions_AcademicallyEventPolls_EventP~` FOREIGN KEY (`EventPollId`) REFERENCES `AcademicallyEventPolls` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyWorkshopPollQuestions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `MinimumResponse` int NULL,
    `MaximumResponse` int NULL,
    `ShareResults` tinyint(1) NOT NULL,
    `WorkshopPollId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyWorkshopPollQuestions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshopPollQuestions_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyWorkshopPollQuestions_AcademicallyWorkshopPolls_~` FOREIGN KEY (`WorkshopPollId`) REFERENCES `AcademicallyWorkshopPolls` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyConversations` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Message` longtext CHARACTER SET utf8mb4 NULL,
    `IsSeen` tinyint(1) NOT NULL,
    `ConversationGroupId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyConversations` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyConversations_AcademicallyConversationGroups_Con~` FOREIGN KEY (`ConversationGroupId`) REFERENCES `AcademicallyConversationGroups` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyConversations_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `AcademicallySessionCandidates` (
    `Id` char(36) NOT NULL,
    `Value` longtext CHARACTER SET utf8mb4 NULL,
    `Type` int NOT NULL,
    `SessionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallySessionCandidates` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallySessionCandidates_AcademicallySessions_SessionId` FOREIGN KEY (`SessionId`) REFERENCES `AcademicallySessions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCoachingPollQuestionOptions` (
    `Id` char(36) NOT NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `CoachingPollQuestionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCoachingPollQuestionOptions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCoachingPollQuestionOptions_AcademicallyCoaching~` FOREIGN KEY (`CoachingPollQuestionId`) REFERENCES `AcademicallyCoachingPollQuestions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCourseConversationReactions` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `Type` int NOT NULL,
    `CourseConversationId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCourseConversationReactions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseConversationReactions_AcademicallyCourseCo~` FOREIGN KEY (`CourseConversationId`) REFERENCES `AcademicallyCourseConversations` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyCourseAssignments` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `StudentCourseSectionId` char(36) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyCourseAssignments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyCourseAssignments_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyCourseAssignments_AcademicallyDocuments_Document~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyCourseAssignments_AcademicallyStudentCourseSecti~` FOREIGN KEY (`StudentCourseSectionId`) REFERENCES `AcademicallyStudentCourseSections` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyEventPollQuestionOptions` (
    `Id` char(36) NOT NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `EventPollQuestionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyEventPollQuestionOptions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventPollQuestionOptions_AcademicallyEventPollQu~` FOREIGN KEY (`EventPollQuestionId`) REFERENCES `AcademicallyEventPollQuestions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyWorkshopPollQuestionOptions` (
    `Id` char(36) NOT NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `WorkshopPollQuestionId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyWorkshopPollQuestionOptions` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyWorkshopPollQuestionOptions_AcademicallyWorkshop~` FOREIGN KEY (`WorkshopPollQuestionId`) REFERENCES `AcademicallyWorkshopPollQuestions` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `AcademicallyConversationDocuments` (
    `Id` char(36) NOT NULL,
    `ConversationId` char(36) NOT NULL,
    `DocumentId` char(36) NOT NULL,
    CONSTRAINT `PK_AcademicallyConversationDocuments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyConversationDocuments_AcademicallyConversations_~` FOREIGN KEY (`ConversationId`) REFERENCES `AcademicallyConversations` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AcademicallyConversationDocuments_AcademicallyDocuments_Docu~` FOREIGN KEY (`DocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_AbpUsers_CoverPhotoDocumentId` ON `AbpUsers` (`CoverPhotoDocumentId`);

CREATE INDEX `IX_AbpUsers_IntroVideoDocumentId` ON `AbpUsers` (`IntroVideoDocumentId`);

CREATE INDEX `IX_AbpUsers_ProfilePictureDocumentId` ON `AbpUsers` (`ProfilePictureDocumentId`);

CREATE INDEX `IX_AcademicallyAcademicLevelQualifications_AcademicLevelId` ON `AcademicallyAcademicLevelQualifications` (`AcademicLevelId`);

CREATE INDEX `IX_AcademicallyAcademicLevelQualifications_CreatorUserId` ON `AcademicallyAcademicLevelQualifications` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyAcademicLevelQualifications_ReviewerUserId` ON `AcademicallyAcademicLevelQualifications` (`ReviewerUserId`);

CREATE INDEX `IX_AcademicallyArticles_CreatorUserId` ON `AcademicallyArticles` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyArticles_LanguageId` ON `AcademicallyArticles` (`LanguageId`);

CREATE INDEX `IX_AcademicallyArticles_ParentId` ON `AcademicallyArticles` (`ParentId`);

CREATE INDEX `IX_AcademicallyArticles_ThumbnailDocumentId` ON `AcademicallyArticles` (`ThumbnailDocumentId`);

CREATE INDEX `IX_AcademicallyCalendarEvents_CreatorUserId` ON `AcademicallyCalendarEvents` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCalendarEvents_ProjectId` ON `AcademicallyCalendarEvents` (`ProjectId`);

CREATE INDEX `IX_AcademicallyCalendarEvents_ProjectOfferId` ON `AcademicallyCalendarEvents` (`ProjectOfferId`);

CREATE INDEX `IX_AcademicallyCoachingPollQuestionOptions_CoachingPollQuestion~` ON `AcademicallyCoachingPollQuestionOptions` (`CoachingPollQuestionId`);

CREATE INDEX `IX_AcademicallyCoachingPollQuestions_CoachingPollId` ON `AcademicallyCoachingPollQuestions` (`CoachingPollId`);

CREATE INDEX `IX_AcademicallyCoachingPollQuestions_CreatorUserId` ON `AcademicallyCoachingPollQuestions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCoachingPolls_CoachingId` ON `AcademicallyCoachingPolls` (`CoachingId`);

CREATE INDEX `IX_AcademicallyCoachingPolls_CreatorUserId` ON `AcademicallyCoachingPolls` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCoachingPresenters_CoachingId` ON `AcademicallyCoachingPresenters` (`CoachingId`);

CREATE INDEX `IX_AcademicallyCoachingPresenters_CreatorUserId` ON `AcademicallyCoachingPresenters` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCoachingPresenters_UserId` ON `AcademicallyCoachingPresenters` (`UserId`);

CREATE INDEX `IX_AcademicallyCoachingResources_CoachingId` ON `AcademicallyCoachingResources` (`CoachingId`);

CREATE INDEX `IX_AcademicallyCoachingResources_CreatorUserId` ON `AcademicallyCoachingResources` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCoachingResources_DocumentId` ON `AcademicallyCoachingResources` (`DocumentId`);

CREATE INDEX `IX_AcademicallyCoachings_CreatorUserId` ON `AcademicallyCoachings` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCoachings_LanguageId` ON `AcademicallyCoachings` (`LanguageId`);

CREATE INDEX `IX_AcademicallyCoachings_ParentId` ON `AcademicallyCoachings` (`ParentId`);

CREATE INDEX `IX_AcademicallyCoachings_ThumbnailDocumentId` ON `AcademicallyCoachings` (`ThumbnailDocumentId`);

CREATE INDEX `IX_AcademicallyCommentReactions_CommentId` ON `AcademicallyCommentReactions` (`CommentId`);

CREATE INDEX `IX_AcademicallyCommentReactions_CreatorUserId` ON `AcademicallyCommentReactions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyComments_CreatorUserId` ON `AcademicallyComments` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyComments_ParentId` ON `AcademicallyComments` (`ParentId`);

CREATE INDEX `IX_AcademicallyConferenceSessionCandidates_ConferenceSessionId` ON `AcademicallyConferenceSessionCandidates` (`ConferenceSessionId`);

CREATE INDEX `IX_AcademicallyConversationDocuments_ConversationId` ON `AcademicallyConversationDocuments` (`ConversationId`);

CREATE INDEX `IX_AcademicallyConversationDocuments_DocumentId` ON `AcademicallyConversationDocuments` (`DocumentId`);

CREATE INDEX `IX_AcademicallyConversationGroups_CalendarEventId` ON `AcademicallyConversationGroups` (`CalendarEventId`);

CREATE INDEX `IX_AcademicallyConversationGroups_ProjectId` ON `AcademicallyConversationGroups` (`ProjectId`);

CREATE INDEX `IX_AcademicallyConversations_ConversationGroupId` ON `AcademicallyConversations` (`ConversationGroupId`);

CREATE INDEX `IX_AcademicallyConversations_CreatorUserId` ON `AcademicallyConversations` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCourseAssignments_CreatorUserId` ON `AcademicallyCourseAssignments` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCourseAssignments_DocumentId` ON `AcademicallyCourseAssignments` (`DocumentId`);

CREATE INDEX `IX_AcademicallyCourseAssignments_StudentCourseSectionId` ON `AcademicallyCourseAssignments` (`StudentCourseSectionId`);

CREATE INDEX `IX_AcademicallyCourseConversationReactions_CourseConversationId` ON `AcademicallyCourseConversationReactions` (`CourseConversationId`);

CREATE INDEX `IX_AcademicallyCourseConversations_CreatorUserId` ON `AcademicallyCourseConversations` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCourseConversations_ParentId` ON `AcademicallyCourseConversations` (`ParentId`);

CREATE INDEX `IX_AcademicallyCourseConversations_StudentCourseId` ON `AcademicallyCourseConversations` (`StudentCourseId`);

CREATE INDEX `IX_AcademicallyCourseRatingAreas_CourseRatingId` ON `AcademicallyCourseRatingAreas` (`CourseRatingId`);

CREATE INDEX `IX_AcademicallyCourseRatings_CourseId` ON `AcademicallyCourseRatings` (`CourseId`);

CREATE INDEX `IX_AcademicallyCourseRatings_CreatorUserId` ON `AcademicallyCourseRatings` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCourses_CreatorUserId` ON `AcademicallyCourses` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyCourses_CurrencyId` ON `AcademicallyCourses` (`CurrencyId`);

CREATE INDEX `IX_AcademicallyCourses_ImageDocumentId` ON `AcademicallyCourses` (`ImageDocumentId`);

CREATE INDEX `IX_AcademicallyCourses_LanguageId` ON `AcademicallyCourses` (`LanguageId`);

CREATE INDEX `IX_AcademicallyCourseSectionPages_CourseSectionId` ON `AcademicallyCourseSectionPages` (`CourseSectionId`);

CREATE INDEX `IX_AcademicallyCourseSectionPages_ImageDocumentId` ON `AcademicallyCourseSectionPages` (`ImageDocumentId`);

CREATE INDEX `IX_AcademicallyCourseSections_CourseId` ON `AcademicallyCourseSections` (`CourseId`);

CREATE INDEX `IX_AcademicallyCourseSections_ImageDocumentId` ON `AcademicallyCourseSections` (`ImageDocumentId`);

CREATE INDEX `IX_AcademicallyCourseSections_ParentId` ON `AcademicallyCourseSections` (`ParentId`);

CREATE INDEX `IX_AcademicallyDbsCertificates_DocumentId` ON `AcademicallyDbsCertificates` (`DocumentId`);

CREATE INDEX `IX_AcademicallyDisciplineTaxonomies_ParentId` ON `AcademicallyDisciplineTaxonomies` (`ParentId`);

CREATE INDEX `IX_AcademicallyEventPollQuestionOptions_EventPollQuestionId` ON `AcademicallyEventPollQuestionOptions` (`EventPollQuestionId`);

CREATE INDEX `IX_AcademicallyEventPollQuestions_CreatorUserId` ON `AcademicallyEventPollQuestions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEventPollQuestions_EventPollId` ON `AcademicallyEventPollQuestions` (`EventPollId`);

CREATE INDEX `IX_AcademicallyEventPolls_CreatorUserId` ON `AcademicallyEventPolls` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEventPolls_EventId` ON `AcademicallyEventPolls` (`EventId`);

CREATE INDEX `IX_AcademicallyEventPresenters_CreatorUserId` ON `AcademicallyEventPresenters` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEventPresenters_EventId` ON `AcademicallyEventPresenters` (`EventId`);

CREATE INDEX `IX_AcademicallyEventPresenters_UserId` ON `AcademicallyEventPresenters` (`UserId`);

CREATE INDEX `IX_AcademicallyEventResources_CreatorUserId` ON `AcademicallyEventResources` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEventResources_DocumentId` ON `AcademicallyEventResources` (`DocumentId`);

CREATE INDEX `IX_AcademicallyEventResources_EventId` ON `AcademicallyEventResources` (`EventId`);

CREATE INDEX `IX_AcademicallyEvents_CreatorUserId` ON `AcademicallyEvents` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEvents_LanguageId` ON `AcademicallyEvents` (`LanguageId`);

CREATE INDEX `IX_AcademicallyEvents_ParentId` ON `AcademicallyEvents` (`ParentId`);

CREATE INDEX `IX_AcademicallyEvents_ThumbnailDocumentId` ON `AcademicallyEvents` (`ThumbnailDocumentId`);

CREATE INDEX `IX_AcademicallyForumReplies_CreatorUserId` ON `AcademicallyForumReplies` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyForumReplies_ForumId` ON `AcademicallyForumReplies` (`ForumId`);

CREATE INDEX `IX_AcademicallyForums_CreatorUserId` ON `AcademicallyForums` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyForumTopics_ForumId` ON `AcademicallyForumTopics` (`ForumId`);

CREATE INDEX `IX_AcademicallyForumTopics_TopicId` ON `AcademicallyForumTopics` (`TopicId`);

CREATE INDEX `IX_AcademicallyPassportVerifications_DocumentId` ON `AcademicallyPassportVerifications` (`DocumentId`);

CREATE INDEX `IX_AcademicallyPhotoIdVerifications_DocumentId` ON `AcademicallyPhotoIdVerifications` (`DocumentId`);

CREATE INDEX `IX_AcademicallyProjectAvailabilities_ProjectId` ON `AcademicallyProjectAvailabilities` (`ProjectId`);

CREATE INDEX `IX_AcademicallyProjectDocuments_DocumentId` ON `AcademicallyProjectDocuments` (`DocumentId`);

CREATE INDEX `IX_AcademicallyProjectDocuments_ProjectId` ON `AcademicallyProjectDocuments` (`ProjectId`);

CREATE INDEX `IX_AcademicallyProjectInvitations_ProjectId` ON `AcademicallyProjectInvitations` (`ProjectId`);

CREATE INDEX `IX_AcademicallyProjectInvitations_TutorId` ON `AcademicallyProjectInvitations` (`TutorId`);

CREATE INDEX `IX_AcademicallyProjectOffers_CreatorUserId` ON `AcademicallyProjectOffers` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyProjectOffers_ProjectId` ON `AcademicallyProjectOffers` (`ProjectId`);

CREATE INDEX `IX_AcademicallyProjects_CreatorUserId` ON `AcademicallyProjects` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyQuestionReactions_CreatorUserId` ON `AcademicallyQuestionReactions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyQuestionReactions_QuestionId` ON `AcademicallyQuestionReactions` (`QuestionId`);

CREATE INDEX `IX_AcademicallyQuestions_CreatorUserId` ON `AcademicallyQuestions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyQuestions_ParentId` ON `AcademicallyQuestions` (`ParentId`);

CREATE INDEX `IX_AcademicallyReferences_DocumentId` ON `AcademicallyReferences` (`DocumentId`);

CREATE INDEX `IX_AcademicallyRescheduleComments_CalendarEventId` ON `AcademicallyRescheduleComments` (`CalendarEventId`);

CREATE INDEX `IX_AcademicallyRescheduleComments_CreatorUserId` ON `AcademicallyRescheduleComments` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyResearchMethods_ParentId` ON `AcademicallyResearchMethods` (`ParentId`);

CREATE INDEX `IX_AcademicallyServiceMappings_Node3Id` ON `AcademicallyServiceMappings` (`Node3Id`);

CREATE INDEX `IX_AcademicallyServices2_ParentId` ON `AcademicallyServices2` (`ParentId`);

CREATE INDEX `IX_AcademicallyServiceSubjects_SubjectId` ON `AcademicallyServiceSubjects` (`SubjectId`);

CREATE INDEX `IX_AcademicallySessionCandidates_SessionId` ON `AcademicallySessionCandidates` (`SessionId`);

CREATE INDEX `IX_AcademicallySessions_CalendarEventId` ON `AcademicallySessions` (`CalendarEventId`);

CREATE INDEX `IX_AcademicallyStudentArticles_ArticleId` ON `AcademicallyStudentArticles` (`ArticleId`);

CREATE INDEX `IX_AcademicallyStudentArticles_CreatorUserId` ON `AcademicallyStudentArticles` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentCourses_CourseId` ON `AcademicallyStudentCourses` (`CourseId`);

CREATE INDEX `IX_AcademicallyStudentCourses_CreatorUserId` ON `AcademicallyStudentCourses` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentCourseSections_CourseSectionId` ON `AcademicallyStudentCourseSections` (`CourseSectionId`);

CREATE INDEX `IX_AcademicallyStudentCourseSections_CreatorUserId` ON `AcademicallyStudentCourseSections` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentCourseSections_StudentCourseId` ON `AcademicallyStudentCourseSections` (`StudentCourseId`);

CREATE INDEX `IX_AcademicallyStudentEvents_CreatorUserId` ON `AcademicallyStudentEvents` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentEvents_EventId` ON `AcademicallyStudentEvents` (`EventId`);

CREATE INDEX `IX_AcademicallyStudentRatings_CreatorUserId` ON `AcademicallyStudentRatings` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentRatings_StudentId` ON `AcademicallyStudentRatings` (`StudentId`);

CREATE INDEX `IX_AcademicallyStudentVideos_CreatorUserId` ON `AcademicallyStudentVideos` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyStudentVideos_VideoId` ON `AcademicallyStudentVideos` (`VideoId`);

CREATE INDEX `IX_AcademicallySubjects_CreatorUserId` ON `AcademicallySubjects` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyTutorRatingAreas_TutorRatingId` ON `AcademicallyTutorRatingAreas` (`TutorRatingId`);

CREATE INDEX `IX_AcademicallyTutorRatings_CreatorUserId` ON `AcademicallyTutorRatings` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyTutorRatings_TutorId` ON `AcademicallyTutorRatings` (`TutorId`);

CREATE INDEX `IX_AcademicallyTutorVerifications_CreatorUserId` ON `AcademicallyTutorVerifications` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyTutorVerificationStepReviewers_TutorVerification~` ON `AcademicallyTutorVerificationStepReviewers` (`TutorVerificationStepId`);

CREATE INDEX `IX_AcademicallyTutorVerificationSteps_TutorVerificationId` ON `AcademicallyTutorVerificationSteps` (`TutorVerificationId`);

CREATE INDEX `IX_AcademicallyUserAvailabilities_UserId` ON `AcademicallyUserAvailabilities` (`UserId`);

CREATE INDEX `IX_AcademicallyUserCalendarEvents_CalendarEventId` ON `AcademicallyUserCalendarEvents` (`CalendarEventId`);

CREATE INDEX `IX_AcademicallyUserCalendarEvents_UserId` ON `AcademicallyUserCalendarEvents` (`UserId`);

CREATE INDEX `IX_AcademicallyUserEducationCourses_AcademicLevelId` ON `AcademicallyUserEducationCourses` (`AcademicLevelId`);

CREATE INDEX `IX_AcademicallyUserEducationCourses_AcademicLevelQualificationId` ON `AcademicallyUserEducationCourses` (`AcademicLevelQualificationId`);

CREATE INDEX `IX_AcademicallyUserEducationCourses_UserEducationId` ON `AcademicallyUserEducationCourses` (`UserEducationId`);

CREATE INDEX `IX_AcademicallyUserEducationDocuments_DocumentId` ON `AcademicallyUserEducationDocuments` (`DocumentId`);

CREATE INDEX `IX_AcademicallyUserEducationDocuments_UserEducationId` ON `AcademicallyUserEducationDocuments` (`UserEducationId`);

CREATE INDEX `IX_AcademicallyUserEducations_UniversityId` ON `AcademicallyUserEducations` (`UniversityId`);

CREATE INDEX `IX_AcademicallyUserEducations_UserId` ON `AcademicallyUserEducations` (`UserId`);

CREATE INDEX `IX_AcademicallyUserFollowers_CreatorUserId` ON `AcademicallyUserFollowers` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyUserFollowers_UserId` ON `AcademicallyUserFollowers` (`UserId`);

CREATE INDEX `IX_AcademicallyUserPublications_CreatorUserId` ON `AcademicallyUserPublications` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyUserPublicationTags_PublicationTagId` ON `AcademicallyUserPublicationTags` (`PublicationTagId`);

CREATE INDEX `IX_AcademicallyUserPublicationTags_UserPublicationId` ON `AcademicallyUserPublicationTags` (`UserPublicationId`);

CREATE INDEX `IX_AcademicallyUserQualificationDocuments_DocumentId` ON `AcademicallyUserQualificationDocuments` (`DocumentId`);

CREATE INDEX `IX_AcademicallyUserQualificationDocuments_UserQualificationId` ON `AcademicallyUserQualificationDocuments` (`UserQualificationId`);

CREATE INDEX `IX_AcademicallyUserResearchInterestDisciplineTaxonomies_Discipl~` ON `AcademicallyUserResearchInterestDisciplineTaxonomies` (`DisciplineTaxonomyId`);

CREATE INDEX `IX_AcademicallyUserResearchInterestDisciplineTaxonomies_UserRes~` ON `AcademicallyUserResearchInterestDisciplineTaxonomies` (`UserResearchInterestId`);

CREATE INDEX `IX_AcademicallyUserResearchInterests_CreatorUserId` ON `AcademicallyUserResearchInterests` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyUserResearchMethodologies_CreatorUserId` ON `AcademicallyUserResearchMethodologies` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyUserResearchMethodologyResearchMethods_ResearchM~` ON `AcademicallyUserResearchMethodologyResearchMethods` (`ResearchMethodId`);

CREATE INDEX `IX_AcademicallyUserResearchMethodologyResearchMethods_UserResea~` ON `AcademicallyUserResearchMethodologyResearchMethods` (`UserResearchMethodologyId`);

CREATE INDEX `IX_AcademicallyUserServiceDisciplineTaxonomies_DisciplineTaxono~` ON `AcademicallyUserServiceDisciplineTaxonomies` (`DisciplineTaxonomyId`);

CREATE INDEX `IX_AcademicallyUserServiceDisciplineTaxonomies_UserServiceId` ON `AcademicallyUserServiceDisciplineTaxonomies` (`UserServiceId`);

CREATE INDEX `IX_AcademicallyUserServices_CreatorUserId` ON `AcademicallyUserServices` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyUserServices_ServiceMappingId` ON `AcademicallyUserServices` (`ServiceMappingId`);

CREATE INDEX `IX_AcademicallyUserServiceSubjects_SubjectId` ON `AcademicallyUserServiceSubjects` (`SubjectId`);

CREATE INDEX `IX_AcademicallyUserServiceSubjects_UserServiceId` ON `AcademicallyUserServiceSubjects` (`UserServiceId`);

CREATE INDEX `IX_AcademicallyUserSpokenLanguages_SpokenLanguageId` ON `AcademicallyUserSpokenLanguages` (`SpokenLanguageId`);

CREATE INDEX `IX_AcademicallyUserSpokenLanguages_UserId` ON `AcademicallyUserSpokenLanguages` (`UserId`);

CREATE INDEX `IX_AcademicallyVideos_CreatorUserId` ON `AcademicallyVideos` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyVideos_DocumentId` ON `AcademicallyVideos` (`DocumentId`);

CREATE INDEX `IX_AcademicallyVideos_LanguageId` ON `AcademicallyVideos` (`LanguageId`);

CREATE INDEX `IX_AcademicallyVideos_ParentId` ON `AcademicallyVideos` (`ParentId`);

CREATE INDEX `IX_AcademicallyVideos_ThumbnailDocumentId` ON `AcademicallyVideos` (`ThumbnailDocumentId`);

CREATE INDEX `IX_AcademicallyWorkHistories_CreatorUserId` ON `AcademicallyWorkHistories` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshopPollQuestionOptions_WorkshopPollQuestion~` ON `AcademicallyWorkshopPollQuestionOptions` (`WorkshopPollQuestionId`);

CREATE INDEX `IX_AcademicallyWorkshopPollQuestions_CreatorUserId` ON `AcademicallyWorkshopPollQuestions` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshopPollQuestions_WorkshopPollId` ON `AcademicallyWorkshopPollQuestions` (`WorkshopPollId`);

CREATE INDEX `IX_AcademicallyWorkshopPolls_CreatorUserId` ON `AcademicallyWorkshopPolls` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshopPolls_WorkshopId` ON `AcademicallyWorkshopPolls` (`WorkshopId`);

CREATE INDEX `IX_AcademicallyWorkshopPresenters_CreatorUserId` ON `AcademicallyWorkshopPresenters` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshopPresenters_UserId` ON `AcademicallyWorkshopPresenters` (`UserId`);

CREATE INDEX `IX_AcademicallyWorkshopPresenters_WorkshopId` ON `AcademicallyWorkshopPresenters` (`WorkshopId`);

CREATE INDEX `IX_AcademicallyWorkshopResources_CreatorUserId` ON `AcademicallyWorkshopResources` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshopResources_DocumentId` ON `AcademicallyWorkshopResources` (`DocumentId`);

CREATE INDEX `IX_AcademicallyWorkshopResources_WorkshopId` ON `AcademicallyWorkshopResources` (`WorkshopId`);

CREATE INDEX `IX_AcademicallyWorkshops_CreatorUserId` ON `AcademicallyWorkshops` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyWorkshops_LanguageId` ON `AcademicallyWorkshops` (`LanguageId`);

CREATE INDEX `IX_AcademicallyWorkshops_ParentId` ON `AcademicallyWorkshops` (`ParentId`);

CREATE INDEX `IX_AcademicallyWorkshops_ThumbnailDocumentId` ON `AcademicallyWorkshops` (`ThumbnailDocumentId`);

ALTER TABLE `AbpUsers` ADD CONSTRAINT `FK_AbpUsers_AcademicallyDocuments_CoverPhotoDocumentId` FOREIGN KEY (`CoverPhotoDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT;

ALTER TABLE `AbpUsers` ADD CONSTRAINT `FK_AbpUsers_AcademicallyDocuments_IntroVideoDocumentId` FOREIGN KEY (`IntroVideoDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT;

ALTER TABLE `AbpUsers` ADD CONSTRAINT `FK_AbpUsers_AcademicallyDocuments_ProfilePictureDocumentId` FOREIGN KEY (`ProfilePictureDocumentId`) REFERENCES `AcademicallyDocuments` (`Id`) ON DELETE RESTRICT;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20220722165450_as_of_july_2022', '3.1.8');

CREATE TABLE `AcademicallyEventOffers` (
    `Id` char(36) NOT NULL,
    `CreationTime` datetime(6) NOT NULL,
    `CreatorUserId` bigint NULL,
    `EventId` char(36) NOT NULL,
    `IsNotDiscounted` tinyint(1) NOT NULL,
    `IsDiscountedByPercentage` tinyint(1) NOT NULL,
    `PercentageDiscount` double NOT NULL,
    `IsDiscountedByAmount` tinyint(1) NOT NULL,
    `DiscountAmount` decimal(65,30) NOT NULL,
    `IsSalesDisplayedInRealtime` tinyint(1) NOT NULL,
    `IsNumberOfUnitsLimited` tinyint(1) NOT NULL,
    `UnitLimit` int NOT NULL,
    `IsOfferDurationLimited` tinyint(1) NOT NULL,
    `OfferLimitHours` int NOT NULL,
    `OfferLimitMinutes` int NOT NULL,
    `OfferLimitSeconds` int NOT NULL,
    CONSTRAINT `PK_AcademicallyEventOffers` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AcademicallyEventOffers_AbpUsers_CreatorUserId` FOREIGN KEY (`CreatorUserId`) REFERENCES `AbpUsers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_AcademicallyEventOffers_AcademicallyEvents_EventId` FOREIGN KEY (`EventId`) REFERENCES `AcademicallyEvents` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_AcademicallyEventOffers_CreatorUserId` ON `AcademicallyEventOffers` (`CreatorUserId`);

CREATE INDEX `IX_AcademicallyEventOffers_EventId` ON `AcademicallyEventOffers` (`EventId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20220722165555_added_event_offer', '3.1.8');

