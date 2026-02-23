#import <Foundation/Foundation.h>
#import <Quartz/Quartz.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        if (argc < 2) {
            printf("Usage: ./read_pdf <file>\n");
            return 1;
        }
        
        NSString *filePath = [NSString stringWithUTF8String:argv[1]];
        NSURL *url = [NSURL fileURLWithPath:filePath];
        
        PDFDocument *pdf = [[PDFDocument alloc] initWithURL:url];
        if (!pdf) {
            printf("Could not read PDF\n");
            return 1;
        }
        
        printf("%s\n", [pdf.string UTF8String]);
    }
    return 0;
}
