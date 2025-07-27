import { z } from 'zod';

export const JsonifySchema = z.object({
  name: z.string(),
  bundleid: z.string().optional(),
  version: z.string(),
  actualfileversion: z.enum(['version', 'dotVersion', 'dashVersion', 'cleanv']).optional(),
  description: z.string().optional(),
  homepage: z.string().url().optional(),
  file: z.string().optional(),
  license: z.string().optional(),
  url: z.string().url().optional(),
  installcmd: z.string().optional(),
  uninstallcmd: z.string().optional(),
  docs: z.string().url().optional(),

  checkver: z
    .object({
      url: z.string(),
      regex: z.string()
    })
    .optional(),

  autoupdate: z
    .object({
      url: z.string()
    })
    .optional(),

  DeploymentOptions: z.object({
    WhenToInstall: z
      .object({
        DataContingincies: z.array(z.any()),
        DiskSpaceRequiredInKb: z.number(),
        DevicePowerRequired: z.number().min(1).max(100),
        RamRequireedInMb: z.number()
      })
      .optional(),

    HowToInstall: z
      .object({
        InstallContext: z.enum(['Device', 'User']),
        InstallCommand: z.string(),
        AdminPrivileges: z.boolean(),
        DeviceRestart: z.enum(['DoNotRestart', 'ForceRestart', 'RestartIfNeeded']),
        RetryCount: z.number().min(1).max(10),
        RetryIntervalInMinutes: z.number().min(1).max(10),
        InstallTimeoutInMinutes: z.number(),
        InstallerRebootExitCode: z.string(),
        InstallerSuccessExitCode: z.string()
      })
      .optional(),

    WhenToCallInstallComplete: z.object({
      UseAdditionalCriteria: z.boolean(),
      IdentifyApplicationBy: z.enum(['DefiningCriteria', 'UseCustomScript']),

      DefiningCriteria: z
        .object({
          CriteriaList: z.array(
            z.object({
              CriteriaType: z.enum(['AppExists', 'RegistryExists', 'FileExists']),
              LogicalCondition: z.enum(['End', 'And', 'Or']),

              AppCriteria: z
                .object({
                  ApplicationIdentifier: z.string(),
                  VersionCondition: z.enum(['Any', 'EqualTo', 'NotEqualTo', 'GreaterThan', 'GreaterThanOrEqualTo', 'LessThanOrEqualTo']),
                  MajorVersion: z.number(),
                  MinorVersion: z.number(),
                  RevisionNumber: z.number(),
                  BuildNumber: z.number()
                })
                .optional(),

              FileCriteria: z
                .object({
                  Path: z.string(),
                  VersionCondition: z.string(),
                  MajorVersion: z.number(),
                  MinorVersion: z.number(),
                  RevisionNumber: z.number(),
                  BuildNumber: z.number(),
                  ModifiedOn: z.string()
                })
                .optional(),

              RegistryCriteria: z
                .object({
                  Path: z.string(),
                  KeyName: z.string(),
                  KeyType: z.enum(['String', 'Binary', 'DWord', 'Qword', 'MultiString', 'ExpandableString', 'Version']),
                  KeyValue: z.any()
                })
                .optional()
            })
          )
        })
        .optional(),

      CustomScript: z
        .object({
          ScriptType: z.enum(['JScript', 'PowerShell', 'VBScript']),
          CommandToRunScript: z.string(),
          CustomScriptFileBlobId: z.number(),
          SuccessExitCode: z.number()
        })
        .optional()
    })
  }),

  FilesOptions: z
    .object({
      AppDependenciesList: z.array(z.any()),
      AppTransformList: z.array(z.any()),
      AppPatchesList: z.array(z.any()),
      ApplicationUninstallProcess: z.object({
        UseCustomScript: z.boolean(),
        CustomScript: z
          .object({
            CustomScriptType: z.literal('Input'),
            UninstallCommand: z.string(),
            UninstallScriptBlobId: z.number()
          })
          .optional()
      })
    })
    .optional()
});

export type JsonifyData = z.infer<typeof JsonifySchema>;