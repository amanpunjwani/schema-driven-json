import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JsonifyData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Folder } from 'lucide-react';

interface FileInputSectionProps {
  form: UseFormReturn<JsonifyData>;
}

export function FileInputSection({ form }: FileInputSectionProps) {
  const { register, formState: { errors }, setValue } = form;
  const [isBinary, setIsBinary] = React.useState(true);

  const handleBinaryChange = (checked: boolean) => {
    setIsBinary(checked);
    if (!checked) {
      setValue('file', undefined);
    }
  };

  return (
    <FormSection title="File Input">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="binary"
            checked={isBinary}
            onCheckedChange={handleBinaryChange}
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
              style={{ display: isBinary ? 'block' : 'none' }}
            />
            <Folder 
              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
              style={{ display: isBinary ? 'block' : 'none' }}
            />
          </div>
          {errors.file && isBinary && (
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
            <Label htmlFor="installcmd">Install Command</Label>
            <Input
              id="installcmd"
              placeholder="Install command"
              {...register('installcmd')}
              className={errors.installcmd ? 'border-destructive' : ''}
            />
            {errors.installcmd && (
              <p className="text-sm text-destructive">{errors.installcmd.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="uninstallcmd">Uninstall Command</Label>
            <Input
              id="uninstallcmd"
              placeholder="Uninstall command"
              {...register('uninstallcmd')}
              className={errors.uninstallcmd ? 'border-destructive' : ''}
            />
            {errors.uninstallcmd && (
              <p className="text-sm text-destructive">{errors.uninstallcmd.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkver">Check Version</Label>
            <div className="space-y-2">
              <Input
                placeholder="URL"
                {...register('checkver.url')}
              />
              <Input
                placeholder="Regex pattern"
                {...register('checkver.regex')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="autoupdate">Auto Update</Label>
            <Input
              placeholder="Update URL"
              {...register('autoupdate.url')}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}