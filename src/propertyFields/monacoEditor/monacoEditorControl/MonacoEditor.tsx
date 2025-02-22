import * as React from 'react';

import { isEmpty } from 'lodash';
import {
  Spinner,
  SpinnerSize,
} from 'office-ui-fabric-react/lib/Spinner';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

import { Elanguages } from './';
import { Error } from './Error';
import { IMonacoEditorProps } from './IMonacoEditorProps';
import {
  EStatus,
  useMonaco,
} from './useMonaco';
import { useMonacoEditorStyles } from './useMonacoEditorStyles';

export const MonacoEditor: React.FunctionComponent<IMonacoEditorProps> = (
  props: React.PropsWithChildren<IMonacoEditorProps>
) => {
  const {
    value,
    onValueChange,
    theme,
    readOnly,
    showLineNumbers,
    showMiniMap,
    language,
    jsonDiagnosticsOptions,
    jscriptDiagnosticsOptions,
  } = props || ({} as IMonacoEditorProps);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<any>(null);
  const { controlClasses } = useMonacoEditorStyles();
  const { monaco, status, error } = useMonaco();

  const onDidChangeModelContent = React.useCallback(
    (e: any): void => {
      if (editorRef.current) {
        let currentValue: string = editorRef.current.getValue();
        if (currentValue !== value) {
          let validationErrors: string[] = [];
          try {
            if (language === Elanguages.json) {
              let jsonParsed: any = JSON.parse(currentValue);
            }
          } catch (e) {
            validationErrors.push(e.message);
          }

          onValueChange(currentValue, validationErrors);
        }
      }
    },
    [onValueChange]
  );

  React.useEffect(() => {
    if (status != EStatus.LOADED) return;

    if (!isEmpty(jsonDiagnosticsOptions) && language === Elanguages.json) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions(jsonDiagnosticsOptions);
    }
    if (!isEmpty(jscriptDiagnosticsOptions) && language === Elanguages.javascript) {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(jscriptDiagnosticsOptions);
    }

    monaco.editor.onDidCreateModel((m: any) => {
      m.updateOptions({
        tabSize: 2,
      });
    });

    //Create the MonacoEditor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: value,
      scrollBeyondLastLine: false,
      theme: theme,
      language: language,
      folding: true,
      readOnly: readOnly,
      lineNumbersMinChars: 4,
      lineNumbers: showLineNumbers ? "on" : "off",
      minimap: {
        enabled: showMiniMap,
      },
    });

    editorRef.current.onDidChangeModelContent(onDidChangeModelContent);
    return () => {
      editorRef?.current?.dispose();
    };
  }, [jsonDiagnosticsOptions, jscriptDiagnosticsOptions, monaco]);

  if (status === EStatus.LOADING) {
    return (
      <Stack horizontal horizontalAlign="center" tokens={{ padding: 25 }}>
        <Spinner size={SpinnerSize.medium} />
      </Stack>
    );
  }
  if (status === EStatus.ERROR) {
    return <Error error={error} show={true} />;
  }
  return (
    <>
      <div ref={containerRef} className={controlClasses.containerStyles} />
    </>
  );
};
