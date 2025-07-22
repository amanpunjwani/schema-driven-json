import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PackagingData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FilesOptionsSectionProps {
  form: UseFormReturn<PackagingData>;
}

export function FilesOptionsSection({ form }: FilesOptionsSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const useCustomScript = watch('FilesOptions.ApplicationUninstallProcess.UseCustomScript');
  const appDependencies = watch('FilesOptions.AppDependenciesList');
  const appTransforms = watch('FilesOptions.AppTransformList');
  const appPatches = watch('FilesOptions.AppPatchesList');

  return (
    <FormSection title="Files Options">
      <div className="space-y-6">
        {/* App Dependencies */}
        <div className="space-y-2">
          <Label>App Dependencies List</Label>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {appDependencies?.length === 0 ? 'No dependencies added' : `${appDependencies?.length} dependencies`}
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Dependency
            </Button>
          </div>
        </div>

        {/* App Transform List */}
        <div className="space-y-2">
          <Label>App Transform List</Label>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {appTransforms?.length === 0 ? 'No transforms added' : `${appTransforms?.length} transforms`}
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Transform
            </Button>
          </div>
        </div>

        {/* App Patches List */}
        <div className="space-y-2">
          <Label>App Patches List</Label>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {appPatches?.length === 0 ? 'No patches added' : `${appPatches?.length} patches`}
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Patch
            </Button>
          </div>
        </div>

        {/* Application Uninstall Process */}
        <FormSection title="Application Uninstall Process" defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="useCustomScript"
                checked={useCustomScript}
                onCheckedChange={(checked) => setValue('FilesOptions.ApplicationUninstallProcess.UseCustomScript', checked)}
              />
              <Label htmlFor="useCustomScript">Use Custom Script</Label>
            </div>

            {useCustomScript && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="uninstallCommand">Uninstall Command</Label>
                  <Input
                    id="uninstallCommand"
                    placeholder="Uninstall command"
                    {...register('FilesOptions.ApplicationUninstallProcess.CustomScript.UninstallCommand')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="uninstallScriptBlobId">Uninstall Script Blob ID</Label>
                  <Input
                    id="uninstallScriptBlobId"
                    type="number"
                    {...register('FilesOptions.ApplicationUninstallProcess.CustomScript.UninstallScriptBlobId', { valueAsNumber: true })}
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