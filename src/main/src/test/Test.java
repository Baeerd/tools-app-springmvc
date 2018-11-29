package test;

import java.io.File;
import java.io.PrintStream;

public class Test {
    public static void main(String[] args) throws  Exception{
        PrintStream printStream = new PrintStream(new File("C:\\Users\\10844\\Desktop\\1.txt"));
        System.setOut(printStream);
        System.out.println("111111111");
    }
}
