import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JsonifyData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DeploymentOptionsSectionProps {
  form: UseFormReturn<JsonifyData>;
}

export function DeploymentOptionsSection({ form }: DeploymentOptionsSectionProps) {
  const { register, setValue, watch, getValues, formState: { errors } } = form;
  
  const installContext = watch('DeploymentOptions.HowToInstall.InstallContext');
  const adminPrivileges = watch('DeploymentOptions.HowToInstall.AdminPrivileges');
  const deviceRestart = watch('DeploymentOptions.HowToInstall.DeviceRestart');
  const identifyBy = watch('DeploymentOptions.WhenToCallInstallComplete.IdentifyApplicationBy');
  const dataContingencies = watch('DeploymentOptions.WhenToInstall.DataContingincies');
  const definingCriteria = watch('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];

  const addCriteria = () => {
    const newCriteria = {
      CriteriaType: 'AppExists' as const,
      LogicalCondition: 'End' as const,
      AppCriteria: {
        ApplicationIdentifier: '',
        VersionCondition: 'Any' as const,
        MajorVersion: 0,
        MinorVersion: 0,
        RevisionNumber: 0,
        BuildNumber: 0,
      }
    };
    
    const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', [...currentCriteria, newCriteria]);
  };

  const removeCriteria = (index: number) => {
    const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
    const updated = currentCriteria.filter((_, i) => i !== index);
    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', updated);
  };

  const updateCriteriaType = (index: number, criteriaType: 'AppExists' | 'FileExists' | 'RegistryExists') => {
    const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
    const updated = [...currentCriteria];
    
    // Reset the criteria object based on type
    if (criteriaType === 'AppExists') {
      updated[index] = {
        ...updated[index],
        CriteriaType: criteriaType,
        AppCriteria: {
          ApplicationIdentifier: '',
          VersionCondition: 'Any' as const,
          MajorVersion: 0,
          MinorVersion: 0,
          RevisionNumber: 0,
          BuildNumber: 0,
        },
        FileCriteria: undefined,
        RegistryCriteria: undefined,
      };
    } else if (criteriaType === 'FileExists') {
      updated[index] = {
        ...updated[index],
        CriteriaType: criteriaType,
        FileCriteria: {
          Path: '',
          VersionCondition: '',
          MajorVersion: 0,
          MinorVersion: 0,
          RevisionNumber: 0,
          BuildNumber: 0,
          ModifiedOn: '',
        },
        AppCriteria: undefined,
        RegistryCriteria: undefined,
      };
    } else if (criteriaType === 'RegistryExists') {
      updated[index] = {
        ...updated[index],
        CriteriaType: criteriaType,
        RegistryCriteria: {
          Path: '',
          KeyName: '',
          KeyType: 'String' as const,
          KeyValue: '',
        },
        AppCriteria: undefined,
        FileCriteria: undefined,
      };
    }
    
    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', updated);
  };

  return (
    <FormSection title="Deployment Options">
      <div className="space-y-6">
        {/* When To Install */}
        <FormSection title="When To Install" defaultOpen={false}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data Contingencies</Label>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {dataContingencies?.length === 0 ? 'No contingencies added' : `${dataContingencies?.length} contingencies`}
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diskSpace">Disk Space Required (KB)</Label>
                <Input
                  id="diskSpace"
                  type="number"
                  {...register('DeploymentOptions.WhenToInstall.DiskSpaceRequiredInKb', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devicePower">Device Power Required (1-100)</Label>
                <Input
                  id="devicePower"
                  type="number"
                  min="1"
                  max="100"
                  {...register('DeploymentOptions.WhenToInstall.DevicePowerRequired', { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ramRequired">RAM Required (MB)</Label>
              <Input
                id="ramRequired"
                type="number"
                {...register('DeploymentOptions.WhenToInstall.RamRequireedInMb', { valueAsNumber: true })}
              />
            </div>
          </div>
        </FormSection>

        {/* How To Install */}
        <FormSection title="How To Install" defaultOpen={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Install Context</Label>
                <Select value={installContext} onValueChange={(value) => setValue('DeploymentOptions.HowToInstall.InstallContext', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Device">Device</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Device Restart</Label>
                <Select value={deviceRestart} onValueChange={(value) => setValue('DeploymentOptions.HowToInstall.DeviceRestart', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DoNotRestart">Do Not Restart</SelectItem>
                    <SelectItem value="ForceRestart">Force Restart</SelectItem>
                    <SelectItem value="RestartIfNeeded">Restart If Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installCommand">Install Command</Label>
              <Input
                id="installCommand"
                {...register('DeploymentOptions.HowToInstall.InstallCommand')}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="adminPrivileges"
                checked={adminPrivileges}
                onCheckedChange={(checked) => setValue('DeploymentOptions.HowToInstall.AdminPrivileges', checked)}
              />
              <Label htmlFor="adminPrivileges">Admin Privileges Required</Label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retryCount">Retry Count (1-10)</Label>
                <Input
                  id="retryCount"
                  type="number"
                  min="1"
                  max="10"
                  {...register('DeploymentOptions.HowToInstall.RetryCount', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
                <Input
                  id="retryInterval"
                  type="number"
                  min="1"
                  max="10"
                  {...register('DeploymentOptions.HowToInstall.RetryIntervalInMinutes', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installTimeout">Install Timeout (minutes)</Label>
                <Input
                  id="installTimeout"
                  type="number"
                  {...register('DeploymentOptions.HowToInstall.InstallTimeoutInMinutes', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rebootExitCode">Installer Reboot Exit Code</Label>
                <Input
                  id="rebootExitCode"
                  {...register('DeploymentOptions.HowToInstall.InstallerRebootExitCode')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successExitCode">Installer Success Exit Code</Label>
                <Input
                  id="successExitCode"
                  {...register('DeploymentOptions.HowToInstall.InstallerSuccessExitCode')}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* When To Call Install Complete */}
        <FormSection title="When To Call Install Complete" defaultOpen={false}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Identify Application By</Label>
              <Select 
                value={identifyBy} 
                onValueChange={(value) => {
                  setValue('DeploymentOptions.WhenToCallInstallComplete.IdentifyApplicationBy', value as any);
                  // Clear the opposite field when switching
                  if (value === 'DefiningCriteria') {
                    setValue('DeploymentOptions.WhenToCallInstallComplete.CustomScript', undefined);
                  } else if (value === 'UseCustomScript') {
                    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria', undefined);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DefiningCriteria">Defining Criteria</SelectItem>
                  <SelectItem value="UseCustomScript">Use Custom Script</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {identifyBy === 'DefiningCriteria' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useAdditionalCriteria"
                    checked={watch('DeploymentOptions.WhenToCallInstallComplete.UseAdditionalCriteria')}
                    onCheckedChange={(checked) => setValue('DeploymentOptions.WhenToCallInstallComplete.UseAdditionalCriteria', checked)}
                  />
                  <Label htmlFor="useAdditionalCriteria">Use Additional Criteria</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Defining Criteria</Label>
                  <div className="space-y-4">
                    {definingCriteria.map((criteria, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Criteria #{index + 1}</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCriteria(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Criteria Type</Label>
                            <Select 
                              value={criteria.CriteriaType} 
                              onValueChange={(value) => updateCriteriaType(index, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AppExists">App Exists</SelectItem>
                                <SelectItem value="FileExists">File Exists</SelectItem>
                                <SelectItem value="RegistryExists">Registry Exists</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Logical Condition</Label>
                            <Select 
                              value={criteria.LogicalCondition} 
                              onValueChange={(value) => {
                                const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
                                const updated = [...currentCriteria];
                                updated[index].LogicalCondition = value as any;
                                setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', updated);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="End">End</SelectItem>
                                <SelectItem value="And">And</SelectItem>
                                <SelectItem value="Or">Or</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* App Criteria */}
                        {criteria.CriteriaType === 'AppExists' && (
                          <div className="space-y-4 pl-4 border-l-2 border-muted">
                            <div className="space-y-2">
                              <Label>Application Identifier</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.AppCriteria.ApplicationIdentifier`)}
                                placeholder="com.example.app"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Version Condition</Label>
                                <Select 
                                  value={criteria.AppCriteria?.VersionCondition} 
                                  onValueChange={(value) => {
                                    const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
                                    const updated = [...currentCriteria];
                                    if (updated[index].AppCriteria) {
                                      updated[index].AppCriteria.VersionCondition = value as any;
                                    }
                                    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', updated);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Any">Any</SelectItem>
                                    <SelectItem value="EqualTo">Equal To</SelectItem>
                                    <SelectItem value="NotEqualTo">Not Equal To</SelectItem>
                                    <SelectItem value="GreaterThan">Greater Than</SelectItem>
                                    <SelectItem value="GreaterThanOrEqualTo">Greater Than or Equal To</SelectItem>
                                    <SelectItem value="LessThanOrEqualTo">Less Than or Equal To</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Major Version</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.AppCriteria.MajorVersion`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Minor Version</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.AppCriteria.MinorVersion`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Revision Number</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.AppCriteria.RevisionNumber`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Build Number</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.AppCriteria.BuildNumber`, { valueAsNumber: true })}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* File Criteria */}
                        {criteria.CriteriaType === 'FileExists' && (
                          <div className="space-y-4 pl-4 border-l-2 border-muted">
                            <div className="space-y-2">
                              <Label>File Path</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.Path`)}
                                placeholder="C:\Program Files\App\app.exe"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Version Condition</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.VersionCondition`)}
                                placeholder="Version condition"
                              />
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Major Version</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.MajorVersion`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Minor Version</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.MinorVersion`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Revision Number</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.RevisionNumber`, { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Build Number</Label>
                                <Input
                                  type="number"
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.BuildNumber`, { valueAsNumber: true })}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Modified On</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.FileCriteria.ModifiedOn`)}
                                placeholder="YYYY-MM-DD"
                              />
                            </div>
                          </div>
                        )}

                        {/* Registry Criteria */}
                        {criteria.CriteriaType === 'RegistryExists' && (
                          <div className="space-y-4 pl-4 border-l-2 border-muted">
                            <div className="space-y-2">
                              <Label>Registry Path</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.RegistryCriteria.Path`)}
                                placeholder="HKEY_LOCAL_MACHINE\SOFTWARE\..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Key Name</Label>
                                <Input
                                  {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.RegistryCriteria.KeyName`)}
                                  placeholder="Version"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Key Type</Label>
                                <Select 
                                  value={criteria.RegistryCriteria?.KeyType} 
                                  onValueChange={(value) => {
                                    const currentCriteria = getValues('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList') || [];
                                    const updated = [...currentCriteria];
                                    if (updated[index].RegistryCriteria) {
                                      updated[index].RegistryCriteria.KeyType = value as any;
                                    }
                                    setValue('DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList', updated);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="String">String</SelectItem>
                                    <SelectItem value="Binary">Binary</SelectItem>
                                    <SelectItem value="DWord">DWord</SelectItem>
                                    <SelectItem value="Qword">Qword</SelectItem>
                                    <SelectItem value="MultiString">MultiString</SelectItem>
                                    <SelectItem value="ExpandableString">ExpandableString</SelectItem>
                                    <SelectItem value="Version">Version</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Key Value</Label>
                              <Input
                                {...register(`DeploymentOptions.WhenToCallInstallComplete.DefiningCriteria.CriteriaList.${index}.RegistryCriteria.KeyValue`)}
                                placeholder="Expected value"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addCriteria}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Criteria
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {identifyBy === 'UseCustomScript' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Script Type</Label>
                  <Select 
                    value={watch('DeploymentOptions.WhenToCallInstallComplete.CustomScript.ScriptType')} 
                    onValueChange={(value) => setValue('DeploymentOptions.WhenToCallInstallComplete.CustomScript.ScriptType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select script type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JScript">JScript</SelectItem>
                      <SelectItem value="PowerShell">PowerShell</SelectItem>
                      <SelectItem value="VBScript">VBScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commandToRunScript">Command To Run Script</Label>
                  <Input
                    id="commandToRunScript"
                    {...register('DeploymentOptions.WhenToCallInstallComplete.CustomScript.CommandToRunScript')}
                    placeholder="powershell.exe -ExecutionPolicy Bypass -File script.ps1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customScriptFileBlobId">Custom Script File Blob ID</Label>
                  <Input
                    id="customScriptFileBlobId"
                    type="number"
                    {...register('DeploymentOptions.WhenToCallInstallComplete.CustomScript.CustomScriptFileBlobId', { valueAsNumber: true })}
                    placeholder="12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successExitCodeScript">Success Exit Code</Label>
                  <Input
                    id="successExitCodeScript"
                    type="number"
                    {...register('DeploymentOptions.WhenToCallInstallComplete.CustomScript.SuccessExitCode', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>
        </FormSection>
      </div>
    </FormSection>
  );
}