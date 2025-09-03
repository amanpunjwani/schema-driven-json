import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JsonifySchema, type JsonifyData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Download, Upload, Save, Copy, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormSection } from './form/FormSection';
import { GeneralSection } from './form/GeneralSection';
import { MetadataSection } from './form/MetadataSection';
import { FileInputSection } from './form/FileInputSection';
import { DeploymentOptionsSection } from './form/DeploymentOptionsSection';
import { FilesOptionsSection } from './form/FilesOptionsSection';

const defaultValues: Partial<JsonifyData> = {
  name: '',
  bundleid: '',
  version: '1.0.0',
  actualfileversion: 'version',
  DeploymentOptions: {
    WhenToInstall: {
      DataContingincies: [],
      DiskSpaceRequiredInKb: 0,
      DevicePowerRequired: 50,
      RamRequireedInMb: 512,
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
  
  // Load saved draft from localStorage
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem('jsonify-draft');
      return saved ? JSON.parse(saved) : defaultValues;
    } catch {
      return defaultValues;
    }
  };
  
  const form = useForm<JsonifyData>({
    resolver: zodResolver(JsonifySchema),
    defaultValues: getSavedDraft(),
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  React.useEffect(() => {
    try {
      // Reorder fields to show description through autoupdate above DeploymentOptions
      const { DeploymentOptions, FilesOptions, ...otherFields } = watchedValues;
      const reorderedValues = {
        ...otherFields,
        DeploymentOptions,
        FilesOptions
      };
      
      const formattedJson = JSON.stringify(reorderedValues, null, 2);
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
      JsonifySchema.parse(data); // Validate before export
      
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">JSONify</h1>
              <p className="text-sm text-muted-foreground">Package Configuration Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadJSON} className="bg-background/50">
              <Upload className="h-4 w-4 mr-2" />
              Load JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="bg-background/50">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handleExportJSON} className="shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Form Panel */}
        <div className="w-1/2 border-r bg-card/50 backdrop-blur-sm">
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6">
              <GeneralSection form={form} />
              <MetadataSection form={form} />
              <FileInputSection form={form} />
              <DeploymentOptionsSection form={form} />
              <FilesOptionsSection form={form} />
            </div>
          </div>
        </div>

        {/* JSON Preview Panel */}
        <div className="w-1/2 bg-gradient-to-b from-muted/30 to-muted/50">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b bg-card/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-foreground">JSON Preview</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyJSON} className="bg-background/50">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleFormat} className="bg-background/50">
                    <Code2 className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <pre className="bg-card/80 backdrop-blur-sm p-6 rounded-xl text-sm font-mono overflow-auto h-full border shadow-inner">
                {jsonPreview}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}