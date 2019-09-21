package com.gx.navarde.paybase;

/**
 * @author glsite.com
 * @version $Rev$
 * @des ${TODO}
 * @updateAuthor $Author$
 * @updateDes ${TODO}
 */
public class UserUtils {
    private Myinter mMyinter;
    public void setiFun(Myinter mMyinter) {
        this.mMyinter = mMyinter;
    }
    public void PayState(boolean mboolean){
        if(mMyinter == null) return;
        mMyinter.myss(mboolean);
    }
}
