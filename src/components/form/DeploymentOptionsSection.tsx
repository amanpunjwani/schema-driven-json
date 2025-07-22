import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PackagingData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DeploymentOptionsSectionProps {
  form: UseFormReturn<PackagingData>;
}

export function DeploymentOptionsSection({ form }: DeploymentOptionsSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const installContext = watch('deploymentOptions.HowToInstall.InstallContext');
  const adminPrivileges = watch('deploymentOptions.HowToInstall.AdminPrivileges');
  const deviceRestart = watch('deploymentOptions.HowToInstall.DeviceRestart');
  const identifyBy = watch('deploymentOptions.WhenToCallInstallComplete.IdentifyApplicationBy');
  const dataContingencies = watch('deploymentOptions.WhenToInstall.DataContingencies');

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
                  {...register('deploymentOptions.WhenToInstall.DiskSpaceRequiredInKb', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devicePower">Device Power Required (1-100)</Label>
                <Input
                  id="devicePower"
                  type="number"
                  min="1"
                  max="100"
                  {...register('deploymentOptions.WhenToInstall.DevicePowerRequired', { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ramRequired">RAM Required (MB)</Label>
              <Input
                id="ramRequired"
                type="number"
                {...register('deploymentOptions.WhenToInstall.RamRequiredInMb', { valueAsNumber: true })}
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
                <Select value={installContext} onValueChange={(value) => setValue('deploymentOptions.HowToInstall.InstallContext', value as any)}>
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
                <Select value={deviceRestart} onValueChange={(value) => setValue('deploymentOptions.HowToInstall.DeviceRestart', value as any)}>
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
                {...register('deploymentOptions.HowToInstall.InstallCommand')}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="adminPrivileges"
                checked={adminPrivileges}
                onCheckedChange={(checked) => setValue('deploymentOptions.HowToInstall.AdminPrivileges', checked)}
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
                  {...register('deploymentOptions.HowToInstall.RetryCount', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
                <Input
                  id="retryInterval"
                  type="number"
                  min="1"
                  max="10"
                  {...register('deploymentOptions.HowToInstall.RetryIntervalInMinutes', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installTimeout">Install Timeout (minutes)</Label>
                <Input
                  id="installTimeout"
                  type="number"
                  {...register('deploymentOptions.HowToInstall.InstallTimeoutInMinutes', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rebootExitCode">Installer Reboot Exit Code</Label>
                <Input
                  id="rebootExitCode"
                  {...register('deploymentOptions.HowToInstall.InstallerRebootExitCode')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successExitCode">Installer Success Exit Code</Label>
                <Input
                  id="successExitCode"
                  {...register('deploymentOptions.HowToInstall.InstallerSuccessExitCode')}
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
              <Select value={identifyBy} onValueChange={(value) => setValue('deploymentOptions.WhenToCallInstallComplete.IdentifyApplicationBy', value as any)}>
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
                    checked={watch('deploymentOptions.WhenToCallInstallComplete.UseAdditionalCriteria')}
                    onCheckedChange={(checked) => setValue('deploymentOptions.WhenToCallInstallComplete.UseAdditionalCriteria', checked)}
                  />
                  <Label htmlFor="useAdditionalCriteria">Use Additional Criteria</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Defining Criteria</Label>
                  <div className="text-sm text-muted-foreground">
                    No criteria added yet
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Criteria
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FormSection>
      </div>
    </FormSection>
  );
}