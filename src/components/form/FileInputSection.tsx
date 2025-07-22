import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PackagingData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Folder } from 'lucide-react';

interface FileInputSectionProps {
  form: UseFormReturn<PackagingData>;
}

export function FileInputSection({ form }: FileInputSectionProps) {
  const { register, formState: { errors } } = form;
  const [isBinary, setIsBinary] = React.useState(true);

  return (
    <FormSection title="File Input">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="binary"
            checked={isBinary}
            onCheckedChange={setIsBinary}
          />
          <Label htmlFor="binary">Binary</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">File Location</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="file"
              placeholder="/path/to/file"
              {...register('file')}
              className={errors.file ? 'border-destructive' : ''}
            />
            <Folder className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
          {errors.file && (
            <p className="text-sm text-destructive">{errors.file.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Download URL</Label>
          <Input
            id="url"
            placeholder="https://example.com/download"
            {...register('url')}
            className={errors.url ? 'border-destructive' : ''}
          />
          {errors.url && (
            <p className="text-sm text-destructive">{errors.url.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="installCmd">Install Command</Label>
            <Input
              id="installCmd"
              placeholder="Install command"
              {...register('installCmd')}
              className={errors.installCmd ? 'border-destructive' : ''}
            />
            {errors.installCmd && (
              <p className="text-sm text-destructive">{errors.installCmd.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="uninstallCmd">Uninstall Command</Label>
            <Input
              id="uninstallCmd"
              placeholder="Uninstall command"
              {...register('uninstallCmd')}
              className={errors.uninstallCmd ? 'border-destructive' : ''}
            />
            {errors.uninstallCmd && (
              <p className="text-sm text-destructive">{errors.uninstallCmd.message}</p>
            )}
          </div>
        </div>
      </div>
    </FormSection>
  );
}