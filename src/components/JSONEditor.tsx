import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagingSchema, type PackagingData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Download, Upload, Save, Copy, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormSection } from './form/FormSection';
import { GeneralSection } from './form/GeneralSection';
import { MetadataSection } from './form/MetadataSection';
import { FileInputSection } from './form/FileInputSection';
import { DeploymentOptionsSection } from './form/DeploymentOptionsSection';
import { FilesOptionsSection } from './form/FilesOptionsSection';

const defaultValues: Partial<PackagingData> = {
  name: '',
  bundleId: '',
  version: '1.0.0',
  actualFileVersion: 'version',
  deploymentOptions: {
    WhenToInstall: {
      DataContingencies: [],
      DiskSpaceRequiredInKb: 0,
      DevicePowerRequired: 50,
      RamRequiredInMb: 512,
    },
    HowToInstall: {
      InstallContext: 'Device',
      InstallCommand: '',
      AdminPrivileges: false,
      DeviceRestart: 'DoNotRestart',
      RetryCount: 3,
      RetryIntervalInMinutes: 5,
      InstallTimeoutInMinutes: 30,
      InstallerRebootExitCode: '0,3010',
      InstallerSuccessExitCode: '0',
    },
    WhenToCallInstallComplete: {
      IdentifyApplicationBy: 'DefiningCriteria',
      UseAdditionalCriteria: false,
      DefiningCriteria: [],
    }
  },
  FilesOptions: {
    AppDependenciesList: [],
    AppTransformList: [],
    AppPatchesList: [],
    ApplicationUninstallProcess: {
      UseCustomScript: false
    }
  }
};

export function JSONEditor() {
  const { toast } = useToast();
  const [jsonPreview, setJsonPreview] = useState('{}');
  
  const form = useForm<PackagingData>({
    resolver: zodResolver(PackagingSchema),
    defaultValues,
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  React.useEffect(() => {
    try {
      const formattedJson = JSON.stringify(watchedValues, null, 2);
      setJsonPreview(formattedJson);
    } catch (error) {
      setJsonPreview('// Invalid JSON data');
    }
  }, [watchedValues]);

  const handleLoadJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            form.reset(data);
            toast({
              title: "JSON Loaded",
              description: "File loaded successfully",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Invalid JSON file",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    localStorage.setItem('jsonify-draft', JSON.stringify(data));
    toast({
      title: "Draft Saved",
      description: "Your work has been saved locally",
    });
  };

  const handleExportJSON = () => {
    try {
      const data = form.getValues();
      PackagingSchema.parse(data); // Validate before export
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name || 'packaging'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "JSON Exported",
        description: "File downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please fix form errors before exporting",
        variant: "destructive",
      });
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonPreview);
    toast({
      title: "Copied",
      description: "JSON copied to clipboard",
    });
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonPreview);
      setJsonPreview(JSON.stringify(parsed, null, 2));
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">JSONify</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadJSON}>
              <Upload className="h-4 w-4 mr-2" />
              Load JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handleExportJSON}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Form Panel */}
        <div className="w-1/2 border-r bg-card">
          <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
            <GeneralSection form={form} />
            <MetadataSection form={form} />
            <FileInputSection form={form} />
            <DeploymentOptionsSection form={form} />
            <FilesOptionsSection form={form} />
          </div>
        </div>

        {/* JSON Preview Panel */}
        <div className="w-1/2 bg-muted/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">JSON Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleFormat}>
                  <Code2 className="h-4 w-4 mr-2" />
                  Format
                </Button>
              </div>
            </div>
            <pre className="bg-card p-4 rounded-lg text-sm font-mono overflow-auto max-h-[calc(100vh-200px)] border">
              {jsonPreview}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}