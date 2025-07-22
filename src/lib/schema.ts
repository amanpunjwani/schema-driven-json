import { z } from 'zod';

// Criteria union
const CriteriaSchema = z.union([
  z.object({
    CriteriaType: z.literal('AppExists'),
    AppCriteria: z.object({
      ApplicationIdentifier: z.string(),
      VersionCondition: z.enum([
        'Any','EqualTo','GreaterThan','NotEqualTo',
        'GreaterThanOrEqualTo','LessThanOrEqualTo'
      ]),
      MajorVersion: z.number().int().nonnegative(),
      MinorVersion: z.number().int().nonnegative(),
      RevisionNumber: z.number().int().nonnegative(),
      BuildNumber: z.number().int().nonnegative(),
    })
  }),
  z.object({
    CriteriaType: z.literal('FileExists'),
    FileCriteria: z.object({
      Path: z.string(),
      VersionCondition: z.enum([
        'Any','EqualTo','GreaterThan','NotEqualTo',
        'GreaterThanOrEqualTo','LessThanOrEqualTo'
      ]),
      MajorVersion: z.number().int().nonnegative(),
      MinorVersion: z.number().int().nonnegative(),
      RevisionNumber: z.number().int().nonnegative(),
      BuildNumber: z.number().int().nonnegative(),
      ModifiedOn: z.string(),
    })
  }),
  z.object({
    CriteriaType: z.literal('RegistryExists'),
    RegistryCriteria: z.object({
      Path: z.string(),
      KeyName: z.string(),
      KeyType: z.enum([
        'String','Binary','DWord','Qword',
        'MultiString','ExpandableString','Version'
      ]),
      KeyValue: z.string(),
    })
  })
]);

export const PackagingSchema = z.object({
  name: z.string(),
  bundleId: z.string(),
  version: z.string(),
  actualFileVersion: z.enum([
    'version','dotVersion','dashVersion','cleanv'
  ]),
  description: z.string().optional(),
  homepage: z.string().url().optional(),
  file: z.string().optional(),
  license: z.string().optional(),
  url: z.string().url().optional(),
  installCmd: z.string().optional(),
  uninstallCmd: z.string().optional(),
  docs: z.string().url().optional(),
  checkVer: z.object({
    url: z.string().url(),
    regex: z.string(),
  }).optional(),
  autoUpdate: z.object({ url: z.string().url() }).optional(),
  deploymentOptions: z.object({
    WhenToInstall: z.object({
      DataContingencies: z.array(z.string()),
      DiskSpaceRequiredInKb: z.number().int(),
      DevicePowerRequired: z.number().int().min(1).max(100),
      RamRequiredInMb: z.number().int(),
    }),
    HowToInstall: z.object({
      InstallContext: z.enum(['Device','User']),
      InstallCommand: z.string(),
      AdminPrivileges: z.boolean(),
      DeviceRestart: z.enum(['DoNotRestart','ForceRestart','RestartIfNeeded']),
      RetryCount: z.number().int().min(1).max(10),
      RetryIntervalInMinutes: z.number().int().min(1).max(10),
      InstallTimeoutInMinutes: z.number().int(),
      InstallerRebootExitCode: z.string(),
      InstallerSuccessExitCode: z.string(),
    }),
    WhenToCallInstallComplete: z.discriminatedUnion('IdentifyApplicationBy', [
      z.object({
        IdentifyApplicationBy: z.literal('DefiningCriteria'),
        UseAdditionalCriteria: z.boolean(),
        LogicalCondition: z.enum(['AND','OR']).optional(),
        DefiningCriteria: z.array(CriteriaSchema),
      }),
      z.object({
        IdentifyApplicationBy: z.literal('UseCustomScript'),
        UseAdditionalCriteria: z.boolean(),
        CustomScript: z.object({
          ScriptType: z.enum(['JScript','PowerShell','VBScript']),
          CommandToRunScript: z.string(),
          CustomScriptFileBlobId: z.number().int(),
          SuccessExitCode: z.number().int(),
        })
      })
    ])
  }),
  FilesOptions: z.object({
    AppDependenciesList: z.array(z.string()).length(0),
    AppTransformList: z.array(z.string()),
    AppPatchesList: z.array(z.string()),
    ApplicationUninstallProcess: z.discriminatedUnion('UseCustomScript', [
      z.object({ UseCustomScript: z.literal(false) }),
      z.object({
        UseCustomScript: z.literal(true),
        CustomScript: z.object({
          CustomScriptType: z.literal('Input'),
          UninstallCommand: z.string(),
          UninstallScriptBlobId: z.number().int(),
        })
      })
    ])
  })
});

export type PackagingData = z.infer<typeof PackagingSchema>;